const { connectDB } = require('./db');

const purchaseOrders = [
    { 
        id: "PO-12345", supplierEmail: "supplier1@example.com", orderDate: new Date("2024-03-10"), 
        status: "Paid", client: "Global Tech Inc.", 
        items: [ { id: "ITEM-001", name: "Industrial Grade Sensor", quantity: 50, status: "Delivered" }, { id: "ITEM-002", name: "Mounting Bracket Kit", quantity: 50, status: "Delivered" } ], 
        documents: [],
        expectedDeliveryDate: new Date("2024-03-20"),
        actualDeliveryDate: new Date("2024-03-19"), // Delivered early
        paymentProcessedDate: new Date("2024-04-05")
    },
    { 
        id: "PO-67890", supplierEmail: "supplier2@example.com", orderDate: new Date("2024-03-12"), 
        status: "Delivered", client: "Advanced Robotics", 
        items: [ { id: "ITEM-003", name: "Servo Motor", quantity: 20, status: "Delivered" }, { id: "ITEM-004", name: "Control Board", quantity: 20, status: "Delivered" } ], 
        documents: [],
        expectedDeliveryDate: new Date("2024-03-25"),
        actualDeliveryDate: new Date("2024-03-27"), // Delivered late
        paymentProcessedDate: null
    },
    { 
        id: "PO-ABCDE", supplierEmail: "supplier1@example.com", orderDate: new Date("2024-03-15"), 
        status: "Paid", client: "Global Tech Inc.", 
        items: [ { id: "ITEM-005", name: "Power Supply Unit", quantity: 100, status: "Delivered" } ], 
        documents: [],
        expectedDeliveryDate: new Date("2024-04-01"),
        actualDeliveryDate: new Date("2024-04-01"), // Delivered on time
        paymentProcessedDate: new Date("2024-04-15")
    }
];

const itemTrackingData = [
    { itemId: "ITEM-001", history: [ { status: "Order Confirmed", location: "Warehouse A", timestamp: "2024-03-11 09:00" }, { status: "Packed", location: "Warehouse A", timestamp: "2024-03-11 14:00" }, { status: "Shipped", location: "Distribution Center", timestamp: "2024-03-12 10:00" }, { status: "In Transit", location: "En route to destination", timestamp: "2024-03-13 08:00" } ] },
    { itemId: "ITEM-002", history: [ { status: "Order Confirmed", location: "Warehouse A", timestamp: "2024-03-11 09:00" }, { status: "Packed", location: "Warehouse A", timestamp: "2024-03-11 14:00" }, { status: "Shipped", location: "Distribution Center", timestamp: "2024-03-12 10:00" }, { status: "Delivered", location: "Client Facility", timestamp: "2024-03-12 16:30" }, { status: "Payment Received", location: "Finance Dept.", timestamp: "2024-03-20 11:00" } ] },
    { itemId: "ITEM-003", history: [ { status: "Order Confirmed", location: "Warehouse B", timestamp: "2024-03-12 11:00" }, { status: "Awaiting Shipment", location: "Warehouse B", timestamp: "2024-03-13 15:00" } ] },
    { itemId: "ITEM-004", history: [ { status: "Processing", location: "Assembly Line", timestamp: "2024-03-12 11:30" } ] }
];


async function seedDatabase() {
    const db = await connectDB();
    console.log('Seeding database...');

    // Clear existing collections
    await db.collection('purchaseorders').deleteMany({});
    await db.collection('itemtracking').deleteMany({});

    // Insert new data
    const poResult = await db.collection('purchaseorders').insertMany(purchaseOrders);
    console.log(`${poResult.insertedCount} documents inserted into purchaseorders.`);

    const trackingResult = await db.collection('itemtracking').insertMany(itemTrackingData);
    console.log(`${trackingResult.insertedCount} documents inserted into itemtracking.`);

    console.log('Database seeded successfully!');
    process.exit();
}

seedDatabase().catch(console.error);