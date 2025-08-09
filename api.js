const express = require('express');
const { getDB } = require('../db');
const { ObjectId } = require('mongodb');

module.exports = function(wss) {
    const router = express.Router();

    // GET all purchase orders (or search by ID)
    router.get('/purchase-orders', async (req, res) => {
        const db = getDB();
        const { search } = req.query;
        let query = {};
        if (search) {
            query = { id: { $regex: search, $options: 'i' } }; // Case-insensitive search
        }
        try {
            const pos = await db.collection('purchaseorders').find(query).toArray();
            res.json(pos);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching purchase orders', error });
        }
    });

    // GET a single purchase order by its internal MongoDB _id
    router.get('/purchase-orders/:id', async (req, res) => {
        const db = getDB();
        try {
            const po = await db.collection('purchaseorders').findOne({ _id: new ObjectId(req.params.id) });
            if (!po) return res.status(404).json({ message: 'PO not found' });
            res.json(po);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching purchase order', error });
        }
    });

    // PATCH - Update the status of a PO item
    router.patch('/purchase-orders/:poId/items/:itemId', async (req, res) => {
        const db = getDB();
        const { poId, itemId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        try {
            const result = await db.collection('purchaseorders').updateOne(
                { id: poId, "items.id": itemId },
                { $set: { "items.$.status": status } }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'PO or Item not found' });
            }

            // Fetch the entire updated PO to broadcast
            const updatedPO = await db.collection('purchaseorders').findOne({ id: poId });

            // Optional: Update the overall PO status if all items are delivered
            if (updatedPO.items.every(i => i.status === 'Delivered')) {
                await db.collection('purchaseorders').updateOne({ id: poId }, { $set: { status: 'Delivered' } });
                updatedPO.status = 'Delivered'; // Reflect this change in the broadcasted object
            }

            // Broadcast the update to all connected WebSocket clients
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify({ type: 'PO_UPDATE', payload: updatedPO }));
                }
            });

            res.json({ message: 'Item status updated successfully', data: updatedPO });
        } catch (error) {
            res.status(500).json({ message: 'Error updating item status', error });
        }
    });

    // POST - Add a document reference to a PO
    router.post('/purchase-orders/:poId/documents', async (req, res) => {
        const db = getDB();
        const { poId } = req.params;
        const { documentName, documentUrl, documentType } = req.body;

        if (!documentName || !documentUrl || !documentType) {
            return res.status(400).json({ message: 'Missing document details' });
        }

        try {
            const updateQuery = {
                $push: {
                    documents: { documentName, documentUrl, documentType, uploadDate: new Date() }
                }
            };

            // If a quality document is uploaded, automatically move status to "Pending Approval"
            if (documentType === 'Quality Certificate') {
                updateQuery.$set = { qualityStatus: 'Pending Approval', qualityFeedback: '' };
            }

            const result = await db.collection('purchaseorders').updateOne({ id: poId }, updateQuery);

            if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'PO not found' });
            }

            // Broadcast the update
            const updatedPO = await db.collection('purchaseorders').findOne({ id: poId });
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify({ type: 'PO_UPDATE', payload: updatedPO }));
                }
            });

            res.status(201).json({ message: 'Document added successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error adding document', error });
        }
    });

    return router;
};