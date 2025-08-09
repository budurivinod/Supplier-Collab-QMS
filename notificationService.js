const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const senderEmail = process.env.SENDER_EMAIL;

/**
 * Sends an email notification for a new Purchase Order.
 * @param {string} supplierEmail - The recipient's email address.
 * @param {object} po - The Purchase Order object.
 */
async function sendNewPONotification(supplierEmail, po) {
    const msg = {
        to: supplierEmail,
        from: senderEmail,
        subject: `New Purchase Order Assigned: ${po.id}`,
        html: `
            <h1>New PO Assigned</h1>
            <p>Hello,</p>
            <p>A new purchase order, <strong>${po.id}</strong>, has been assigned to you.</p>
            <p>Please log in to the supplier portal to view the details.</p>
        `,
    };
    await sgMail.send(msg);
}

/**
 * Sends an email notification for a PO status change.
 * @param {string} supplierEmail - The recipient's email address.
 * @param {object} po - The updated Purchase Order object.
 * @param {string} updatedItem - The ID of the item that was updated.
 * @param {string} newStatus - The new status of the item.
 */
async function sendStatusUpdateNotification(supplierEmail, po, updatedItem, newStatus) {
    const msg = {
        to: supplierEmail,
        from: senderEmail,
        subject: `Status Update for PO ${po.id}`,
        html: `<h1>PO Status Update</h1><p>The status for item <strong>${updatedItem}</strong> in purchase order <strong>${po.id}</strong> has been updated to: <strong>${newStatus}</strong>.</p>`,
    };
    await sgMail.send(msg);
}

module.exports = { sendNewPONotification, sendStatusUpdateNotification };