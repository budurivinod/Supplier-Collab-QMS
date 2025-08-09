document.addEventListener('DOMContentLoaded', () => {

    // --- 3. DOM Element References ---
    const views = document.querySelectorAll('.view');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const supplierDashboardView = document.getElementById('supplier-dashboard-view');
    const clientDashboardView = document.getElementById('client-dashboard-view');

    // Forms and Links
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    const registerSuccess = document.getElementById('register-success');

    // Logout Buttons
    const supplierLogoutBtn = document.getElementById('supplier-logout-btn');
    const clientLogoutBtn = document.getElementById('client-logout-btn');

    // Supplier Dashboard Elements
    const poSearchInput = document.getElementById('po-search-input');
    const poSearchBtn = document.getElementById('po-search-btn');
    const poListContainer = document.getElementById('po-list');
    const homeBtn = document.getElementById('home-btn');
    const reportsBtn = document.getElementById('reports-btn');
    const mainDashboardLayout = document.getElementById('main-dashboard-layout');
    const reportingModule = document.getElementById('reporting-module');
    const poDetailsContent = document.getElementById('po-details-content');
    const supplierDisplayName = document.getElementById('supplier-display-name');
    const qualityClearanceContainer = document.getElementById('quality-clearance-container');

    // Client Dashboard Elements
    const clientDisplayName = document.getElementById('client-display-name');
    const clientPoListContainer = document.getElementById('client-po-list');
    const clientPoDetailsContent = document.getElementById('client-po-details-content');
    // New AI Agent elements for Client Dashboard
    const supplierSelect = document.getElementById('supplier-select');
    const analyzeSupplierBtn = document.getElementById('analyze-supplier-btn');
    const supplierSummary = document.getElementById('supplier-summary');
    // New Comparison Tool elements
    const supplier1Select = document.getElementById('supplier-1-select');
    const supplier2Select = document.getElementById('supplier-2-select');
    const compareSuppliersBtn = document.getElementById('compare-suppliers-btn');
    const comparisonResults = document.getElementById('comparison-results');
    // New RFP Comparison elements
    const compareRfpsBtn = document.getElementById('compare-rfps-btn');
    const rfpFile1Input = document.getElementById('rfp-file-1');
    const rfpFile2Input = document.getElementById('rfp-file-2');
    const rfpComparisonSummary = document.getElementById('rfp-comparison-summary');
    // New Risk Assessment elements
    const riskSupplierSelect = document.getElementById('risk-supplier-select');
    const assessRiskBtn = document.getElementById('assess-risk-btn');
    const riskAssessmentSummary = document.getElementById('risk-assessment-summary');
    
    // Elements from the inline script, now consolidated here
    const generateBtn = document.getElementById('generate-message-btn');
    const sendBtn = document.getElementById('send-message-btn');
    const detailsTabsContainer = document.getElementById('po-details-tabs-container');
    const detailsPlaceholder = document.getElementById('po-details-placeholder');
    const clientToolsTabsContainer = document.getElementById('client-tools-tabs-container');
    const supplierProfileBtn = document.getElementById('supplier-profile-btn');
    const clientProfileBtn = document.getElementById('client-profile-btn');
    const profileModal = document.getElementById('profile-edit-modal');
    const profileForm = document.getElementById('profile-edit-form');
    const profileNameInput = document.getElementById('profile-edit-name');
    const profileNewPasswordInput = document.getElementById('profile-edit-new-password');
    const profileConfirmPasswordInput = document.getElementById('profile-edit-confirm-password');
    const closeProfileModalBtn = document.querySelector('.close-profile-modal-btn');
    const uploadBtn = document.getElementById('upload-quality-cert-btn');

    // New PO Modal Elements
    const createPoBtn = document.getElementById('create-po-btn');
    const createPoModal = document.getElementById('create-po-modal');
    const closeCreatePoModalBtn = document.querySelector('.close-create-po-modal-btn');
    const createPoForm = document.getElementById('create-po-form');
    const poItemsContainer = document.getElementById('po-items-container');
    const addItemBtn = document.getElementById('add-item-btn');
    const createPoError = document.getElementById('create-po-error');

    // Modal Elements
    const itemTrackingModal = document.getElementById('item-tracking-modal');
    const closeButton = document.querySelector('.close-button');
    const trackingItemName = document.getElementById('tracking-item-name');
    const trackingTimeline = document.getElementById('tracking-timeline');
    let comparisonChart = null; // For the comparison tool chart


    let purchaseOrders = []; // This will be populated from the API

    // --- AI Agent Configuration ---
    const proxyApiUrl = '/api/generate-message'; // Placeholder for your backend proxy

    // --- Simulated User Database ---
    let usersDB = JSON.parse(localStorage.getItem('usersDB')) || [
        { name: 'Global Tech Parts', email: 'supplier@test.com', password: 'password', role: 'supplier' },
        { name: 'Advanced Robotics Parts', email: 'supplier2@test.com', password: 'password', role: 'supplier' },
        { name: 'Innovate Supplies', email: 'supplier3@test.com', password: 'password', role: 'supplier' },
        { name: 'ACME Corp Admin', email: 'client@test.com', password: 'password', role: 'client' }
    ];

    const saveUsersDB = () => {
        localStorage.setItem('usersDB', JSON.stringify(usersDB));
    };

    // Persist PO data changes across sessions
    let dummyPOData = JSON.parse(localStorage.getItem('dummyPOData')) || [
        // Initial data will be populated if localStorage is empty
    ];

    // --- Dummy Database ---
    const initialPOData = [
        { 
            id: "PO-12345", supplierEmail: "supplier@test.com", orderDate: "2024-03-10T00:00:00.000Z", 
            status: "Paid", client: "Global Tech Inc.", 
            items: [ { id: "ITEM-001", name: "Industrial Grade Sensor", quantity: 50, status: "Delivered", unitPrice: 150 }, { id: "ITEM-002", name: "Mounting Bracket Kit", quantity: 50, status: "Delivered", unitPrice: 25 } ], 
            documents: [],
            expectedDeliveryDate: "2024-03-20T00:00:00.000Z",
            actualDeliveryDate: "2024-03-19T00:00:00.000Z", // Delivered early
            paymentProcessedDate: "2024-04-05T00:00:00.000Z",
            transactionId: "TRN-2024-A4B5C6",
            qualityStatus: "Approved",
            qualityFeedback: "All documents look great. Approved for final payment."
        },
        { 
            id: "PO-67890", supplierEmail: "supplier2@test.com", orderDate: "2024-03-12T00:00:00.000Z", 
            status: "Delivered", client: "Advanced Robotics", 
            items: [ { id: "ITEM-003", name: "Servo Motor", quantity: 20, status: "Delivered", unitPrice: 80 }, { id: "ITEM-004", name: "Control Board", quantity: 20, status: "Delivered", unitPrice: 120 } ], 
            documents: [],
            expectedDeliveryDate: "2024-03-25T00:00:00.000Z",
            actualDeliveryDate: "2024-03-27T00:00:00.000Z", // Delivered late
            paymentProcessedDate: null,
            qualityStatus: "Rejected",
            qualityFeedback: "The provided ISO certificate has expired. Please upload a valid certificate."
        },
        { 
            id: "PO-ABCDE", supplierEmail: "supplier@test.com", orderDate: "2024-03-15T00:00:00.000Z", 
            status: "Delivered", client: "Global Tech Inc.", 
            items: [ { id: "ITEM-005", name: "Power Supply Unit", quantity: 100, status: "Delivered", unitPrice: 45 } ], 
            documents: [],
            expectedDeliveryDate: "2024-04-01T00:00:00.000Z",
            actualDeliveryDate: "2024-04-01T00:00:00.000Z", // Delivered on time
            paymentProcessedDate: null,
            qualityStatus: "Not Submitted",
            qualityFeedback: ""
        },
        { 
            id: "PO-XYZ-01", supplierEmail: "supplier3@test.com", orderDate: "2024-04-02T00:00:00.000Z", 
            status: "Processing", client: "Innovate Solutions", 
            items: [ { id: "ITEM-006", name: "High-Torque Stepper Motor", quantity: 15, status: "Processing", unitPrice: 95 } ], 
            documents: [],
            expectedDeliveryDate: "2024-04-20T00:00:00.000Z",
            actualDeliveryDate: null,
            paymentProcessedDate: null,
            qualityStatus: "Not Submitted",
            qualityFeedback: ""
        },
        { 
            id: "PO-XYZ-02", supplierEmail: "supplier@test.com", orderDate: "2024-04-05T00:00:00.000Z", 
            status: "Shipped", client: "Global Tech Inc.", 
            items: [ { id: "ITEM-007", name: "FPGA Development Board", quantity: 10, status: "Shipped", unitPrice: 250 } ], 
            documents: [],
            expectedDeliveryDate: "2024-04-22T00:00:00.000Z",
            actualDeliveryDate: null,
            paymentProcessedDate: null,
            qualityStatus: "Not Submitted",
            qualityFeedback: ""
        },
        { 
            id: "PO-LMN-03", supplierEmail: "supplier2@test.com", orderDate: "2024-02-20T00:00:00.000Z", 
            status: "Paid", client: "Advanced Robotics", 
            items: [ { id: "ITEM-008", name: "Robotic Arm Assembly", quantity: 2, status: "Delivered", unitPrice: 1200 } ], 
            documents: [],
            expectedDeliveryDate: "2024-03-15T00:00:00.000Z",
            actualDeliveryDate: "2024-03-14T00:00:00.000Z",
            paymentProcessedDate: "2024-03-30T00:00:00.000Z",
            transactionId: "TRN-2024-D7E8F9",
            qualityStatus: "Approved",
            qualityFeedback: "Excellent quality."
        },
        { 
            id: "PO-LMN-04", supplierEmail: "supplier3@test.com", orderDate: "2024-04-10T00:00:00.000Z", 
            status: "Delivered", client: "Innovate Solutions", 
            items: [ { id: "ITEM-009", name: "Laser Diode Module", quantity: 100, status: "Delivered", unitPrice: 12 } ], 
            documents: [],
            expectedDeliveryDate: "2024-04-25T00:00:00.000Z",
            actualDeliveryDate: "2024-04-26T00:00:00.000Z", // Late
            paymentProcessedDate: null,
            qualityStatus: "Pending Approval",
            qualityFeedback: ""
        },
        { 
            id: "PO-PQR-05", supplierEmail: "supplier@test.com", orderDate: "2024-01-15T00:00:00.000Z", 
            status: "Paid", client: "Global Tech Inc.", 
            items: [ { id: "ITEM-010", name: "Rackmount Server Chassis", quantity: 5, status: "Delivered", unitPrice: 350 } ], 
            documents: [],
            expectedDeliveryDate: "2024-02-01T00:00:00.000Z",
            actualDeliveryDate: "2024-01-30T00:00:00.000Z",
            paymentProcessedDate: "2024-02-15T00:00:00.000Z",
            transactionId: "TRN-2024-G1H2I3",
            qualityStatus: "Approved",
            qualityFeedback: ""
        }
    ];

    // Populate dummy data if it's the first time
    if (dummyPOData.length === 0) {
        dummyPOData = initialPOData;
        localStorage.setItem('dummyPOData', JSON.stringify(dummyPOData));
    }

    // --- Dummy Item Tracking History ---
    const dummyItemTrackingData = {
        "ITEM-001": [ { status: "Order Confirmed", location: "Warehouse A", timestamp: "2024-03-11T09:00:00Z" }, { status: "Packed", location: "Warehouse A", timestamp: "2024-03-11T14:00:00Z" }, { status: "Shipped", location: "Distribution Center", timestamp: "2024-03-12T10:00:00Z" }, { status: "In Transit", location: "En route to destination", timestamp: "2024-03-13T08:00:00Z" }, { status: "Delivered", location: "Client Facility", timestamp: "2024-03-19T10:00:00Z" } ],
        "ITEM-002": [ { status: "Order Confirmed", location: "Warehouse A", timestamp: "2024-03-11T09:00:00Z" }, { status: "Packed", location: "Warehouse A", timestamp: "2024-03-11T14:00:00Z" }, { status: "Shipped", location: "Distribution Center", timestamp: "2024-03-12T10:00:00Z" }, { status: "Delivered", location: "Client Facility", timestamp: "2024-03-19T10:00:00Z" } ],
        "ITEM-003": [ { status: "Order Confirmed", location: "Warehouse B", timestamp: "2024-03-12T11:00:00Z" }, { status: "Awaiting Shipment", location: "Warehouse B", timestamp: "2024-03-13T15:00:00Z" }, { status: "Shipped", location: "Distribution Center", timestamp: "2024-03-14T11:00:00Z" }, { status: "In Transit", location: "En route to destination", timestamp: "2024-03-15T09:00:00Z" }, { status: "Delivered", location: "Client Facility", timestamp: "2024-03-27T14:00:00Z" } ],
        "ITEM-004": [ { status: "Processing", location: "Assembly Line", timestamp: "2024-03-12T11:30:00Z" }, { status: "Awaiting Shipment", location: "Warehouse B", timestamp: "2024-03-15T15:00:00Z" }, { status: "Shipped", location: "Distribution Center", timestamp: "2024-03-16T11:00:00Z" }, { status: "In Transit", location: "En route to destination", timestamp: "2024-03-17T09:00:00Z" }, { status: "Delivered", location: "Client Facility", timestamp: "2024-03-27T14:00:00Z" } ],
        "ITEM-005": [ { status: "Delivered", location: "Client Facility", timestamp: "2024-04-01T10:00:00Z" } ],
        "ITEM-006": [ { status: "Processing", location: "Assembly Line", timestamp: "2024-04-02T11:30:00Z" } ],
        "ITEM-007": [ { status: "Order Confirmed", location: "Warehouse C", timestamp: "2024-04-06T10:00:00Z" }, { status: "Packed", location: "Warehouse C", timestamp: "2024-04-06T15:00:00Z" }, { status: "Shipped", location: "Distribution Center", timestamp: "2024-04-07T11:00:00Z" } ],
        "ITEM-008": [ { status: "Delivered", location: "Client Facility", timestamp: "2024-03-14T10:00:00Z" } ],
        "ITEM-009": [ { status: "Delivered", location: "Client Facility", timestamp: "2024-04-26T10:00:00Z" } ],
        "ITEM-010": [ { status: "Delivered", location: "Client Facility", timestamp: "2024-01-30T10:00:00Z" } ]
    };

    // --- 5. Real-Time Simulation State ---
    let activeTrackingInterval = null; // To hold the timer for the status simulation
    let selectedFiles = []; // Stores files selected for upload
    const statusSequence = [
        "Processing",
        "Awaiting Shipment",
        "Shipped",
        "In Transit",
        "Delivered"
    ];

    // --- View Management ---
    const showView = (viewId) => {
        views.forEach(view => view.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
    };

    // --- Authentication Logic ---
    const handleLogin = (e) => {
        e.preventDefault();
        loginError.textContent = '';
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const user = usersDB.find(u => u.email === email && u.password === password);

        if (user) {
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
            // Notify parent dashboard of login
            setTimeout(() => {
                window.parent.postMessage({ type: 'userLoggedIn' }, '*');
            }, 500);
            routeToDashboard(user);
        } else {
            loginError.textContent = 'Invalid email or password.';
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        registerError.textContent = '';
        registerSuccess.textContent = '';

        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const role = document.getElementById('user-role').value;

        if (usersDB.some(u => u.email === email)) {
            registerError.textContent = 'An account with this email already exists.';
            return;
        }

        usersDB.push({ name, email, password, role });
        saveUsersDB();
        registerSuccess.textContent = 'Registration successful! Please log in.';
        registerForm.reset();
        // After success, automatically switch back to the login view
        setTimeout(() => showView('login-view'), 2000);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('loggedInUser');
        // Notify parent dashboard of logout
        window.parent.postMessage({ type: 'userLoggedOut' }, '*');
        showView('login-view');
    };

    const routeToDashboard = (user) => {
        if (user.role === 'supplier') {
            initializeSupplierDashboard(user);
            showView('supplier-dashboard-view');
        } else if (user.role === 'client') {
            initializeClientDashboard(user);
            showView('client-dashboard-view');
        } else {
            showView('login-view');
        }
    };

    const checkLoginState = () => {
        const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (user) {
            routeToDashboard(user);
        } else {
            showView('login-view');
        }
    };

    // --- Supplier Dashboard Logic ---
    const initializeSupplierDashboard = () => {
        const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
        supplierDisplayName.textContent = user.name;
        initializeReportingModule();

        homeBtn.addEventListener('click', () => {
            mainDashboardLayout.style.display = 'flex';
            reportingModule.style.display = 'none';
            homeBtn.classList.add('active');
            reportsBtn.classList.remove('active');
            resetDashboard(); // Also reset the PO list and search
        });

        reportsBtn.addEventListener('click', () => {
            mainDashboardLayout.style.display = 'none';
            reportingModule.style.display = 'block';
            homeBtn.classList.remove('active');
            reportsBtn.classList.add('active');
        });

        poSearchBtn.addEventListener('click', () => renderPOList(poSearchInput.value));

        // Set initial state by simulating a click on the home button
        homeBtn.click();

        poSearchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                renderPOList(poSearchInput.value);
            }
        });
    };

    // --- Client Dashboard Logic ---
    const initializeClientDashboard = (user) => {
        clientDisplayName.textContent = user.name;
        renderAllPOsForClient();
        populateSupplierSelector(); // For the AI analyst
        populateComparisonSelectors(); // For the new comparison tool
        populateRiskSupplierSelector(); // For the new risk tool

        createPoBtn.addEventListener('click', openCreatePoModal);
        closeCreatePoModalBtn.addEventListener('click', closeCreatePoModal);
        createPoForm.addEventListener('submit', handleCreatePO);
        addItemBtn.addEventListener('click', addPOItemField);
        poItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item-btn')) {
                e.target.closest('.po-item-entry').remove();
            }
        });

        analyzeSupplierBtn.addEventListener('click', handleSupplierAnalysis);
        compareSuppliersBtn.addEventListener('click', handleSupplierComparison);
        if (compareRfpsBtn) {
            compareRfpsBtn.addEventListener('click', handleRFPComparison);
        }
        if (assessRiskBtn) {
            assessRiskBtn.addEventListener('click', handleRiskAssessment);
        }
    };

    const openCreatePoModal = () => {
        createPoForm.reset();
        poItemsContainer.innerHTML = `
            <div class="po-item-entry">
                <div class="form-group">
                    <label>Item Name</label>
                    <input type="text" class="po-item-name" placeholder="e.g., Industrial Grade Sensor" required>
                </div>
                <div class="form-group">
                    <label>Quantity</label>
                    <input type="number" class="po-item-quantity" min="1" value="1" required>
                </div>
                <div class="form-group">
                    <label>Unit Price</label>
                    <input type="number" class="po-item-unit-price" min="0.01" step="0.01" value="0.01" required>
                </div>
                <button type="button" class="btn btn-danger remove-item-btn">&times; Remove</button>
            </div>
        `;
        createPoError.textContent = '';
        createPoModal.style.display = 'flex';
    };

    const closeCreatePoModal = () => {
        createPoModal.style.display = 'none';
    };

    const addPOItemField = () => {
        const newItemEntry = document.createElement('div');
        newItemEntry.className = 'po-item-entry';
        newItemEntry.innerHTML = `
            <div class="form-group">
                <label>Item Name</label>
                <input type="text" class="po-item-name" placeholder="e.g., Industrial Grade Sensor" required>
            </div>
            <div class="form-group">
                <label>Quantity</label>
                <input type="number" class="po-item-quantity" min="1" value="1" required>
            </div>
            <div class="form-group">
                <label>Unit Price</label>
                <input type="number" class="po-item-unit-price" min="0.01" step="0.01" value="0.01" required>
            </div>
            <button type="button" class="btn btn-danger remove-item-btn">&times; Remove</button>
        `;
        poItemsContainer.appendChild(newItemEntry);
    };

    const handleCreatePO = (e) => {
        e.preventDefault();
        createPoError.textContent = '';

        const poId = document.getElementById('po-id').value.trim() || `PO-${Date.now()}`;
        const supplierEmail = document.getElementById('po-supplier-email').value.trim();
        const orderDate = document.getElementById('po-order-date').value;
        const expectedDeliveryDate = document.getElementById('po-expected-delivery-date').value;

        const itemNames = Array.from(document.querySelectorAll('.po-item-name')).map(input => input.value.trim());
        const itemQuantities = Array.from(document.querySelectorAll('.po-item-quantity')).map(input => parseInt(input.value));
        const itemUnitPrices = Array.from(document.querySelectorAll('.po-item-unit-price')).map(input => parseFloat(input.value));

        // Basic validation
        if (!supplierEmail || !orderDate || !expectedDeliveryDate || itemNames.some(name => !name) || itemQuantities.some(q => isNaN(q) || q <= 0) || itemUnitPrices.some(p => isNaN(p) || p <= 0)) {
            createPoError.textContent = 'Please fill in all required fields and ensure quantities/prices are valid.';
            return;
        }

        if (!usersDB.some(user => user.email === supplierEmail && user.role === 'supplier')) {
            createPoError.textContent = 'Supplier email not found or is not a registered supplier.';
            return;
        }

        const newItems = itemNames.map((name, index) => ({
            id: `ITEM-${Date.now()}-${index}`,
            name: name,
            quantity: itemQuantities[index],
            unitPrice: itemUnitPrices[index],
            status: 'Pending Acceptance'
        }));

        const newPO = {
            id: poId,
            supplierEmail: supplierEmail,
            orderDate: new Date(orderDate).toISOString(),
            status: 'Pending Acceptance',
            client: JSON.parse(sessionStorage.getItem('loggedInUser')).name,
            items: newItems,
            documents: [],
            expectedDeliveryDate: new Date(expectedDeliveryDate).toISOString(),
            actualDeliveryDate: null,
            paymentProcessedDate: null,
            qualityStatus: 'Not Submitted',
            qualityFeedback: ''
        };

        dummyPOData.push(newPO);
        localStorage.setItem('dummyPOData', JSON.stringify(dummyPOData));
        showToast(`New PO ${poId} created successfully!`);
        closeCreatePoModal();
        renderAllPOsForClient(); // Refresh the client PO list
    };

    // Global function for Supplier PO actions (Accept/Reject)
    window.handleSupplierPOAction = (poId, action) => {
        const poIndex = dummyPOData.findIndex(p => p.id === poId);
        if (poIndex > -1) {
            dummyPOData[poIndex].status = action;
            // If accepted, update item statuses from 'Pending Acceptance' to 'Processing'
            if (action === 'Processing') {
                dummyPOData[poIndex].items.forEach(item => {
                    if (item.status === 'Pending Acceptance') {
                        item.status = 'Processing';
                    }
                });
            }
            localStorage.setItem('dummyPOData', JSON.stringify(dummyPOData));
            showToast(`PO ${poId} has been updated to ${action}.`, action === 'Processing' ? 'success' : 'danger');
            displayPODetails(poId); // Refresh details for the current PO in supplier view
        }
    };

    const showToast = (message, type = 'info') => {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    };

    const renderAllPOsForClient = () => {
        clientPoListContainer.innerHTML = '';
        clientPoDetailsContent.innerHTML = '<p class="placeholder-text">Select a Purchase Order to view and manage.</p>';

        dummyPOData.forEach(po => {
            const poItem = document.createElement('div');
            poItem.className = 'po-list-item';
            poItem.dataset.poId = po.id;
            const supplierUser = usersDB.find(u => u.email === po.supplierEmail);
            const supplierName = supplierUser ? supplierUser.name : po.supplierEmail; // Fallback to email if no user found
            poItem.innerHTML = `<strong>${po.id}</strong><br><span>Supplier: ${supplierName}</span><br><span>Status: ${po.status}</span>`;
            poItem.addEventListener('click', () => {
                document.querySelectorAll('#client-po-list .po-list-item.active').forEach(item => item.classList.remove('active'));
                poItem.classList.add('active');
                displayClientPODetails(po.id);
            });
            clientPoListContainer.appendChild(poItem);
        });
    };

    const displayClientPODetails = (poId) => {
        const po = dummyPOData.find(p => p.id === poId);
        if (!po) return;

        let itemsHtml = po.items.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.unitPrice}</td>
                <td>${item.status}</td>
            </tr>
        `).join('');

        const supplierUser = usersDB.find(u => u.email === po.supplierEmail);
        const supplierName = supplierUser ? supplierUser.name : po.supplierEmail;

        clientPoDetailsContent.innerHTML = `
            <div class="po-details-header">
                <h3>Details for ${po.id}</h3>
                <p><strong>Supplier:</strong> ${supplierName} | <strong>Client:</strong> ${po.client} | <strong>Order Date:</strong> ${new Date(po.orderDate).toLocaleDateString()} | <strong>Expected Delivery:</strong> ${new Date(po.expectedDeliveryDate).toLocaleDateString()}</p>
                <p><strong>Overall Status:</strong> ${po.status}</p>
            </div>
            <table class="po-items-table">
                <thead>
                    <tr><th>Item ID</th><th>Item Name</th><th>Quantity</th><th>Unit Price</th><th>Current Status</th></tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
            </table>
        `;
    };

    const populateComparisonSelectors = () => {
        const supplierEmails = [...new Set(dummyPOData.map(po => po.supplierEmail))];
        supplier1Select.innerHTML = '<option value="">-- Choose Supplier --</option>';
        supplier2Select.innerHTML = '<option value="">-- Choose Supplier --</option>';
        supplierEmails.sort().forEach(email => {
            const option1 = document.createElement('option');
            const option2 = document.createElement('option');
            option1.value = email;
            option2.value = email;
            const supplierUser = usersDB.find(u => u.email === email);
            const text = supplierUser ? supplierUser.name : email;
            option1.textContent = text;
            option2.textContent = text;
            supplier1Select.appendChild(option1);
            supplier2Select.appendChild(option2);
        });
    };

    const updateItemStatus = (poId, itemId, newStatus) => {
        const po = dummyPOData.find(p => p.id === poId);
        const item = po.items.find(i => i.id === itemId);
        if (item) {
            item.status = newStatus;
            localStorage.setItem('dummyPOData', JSON.stringify(dummyPOData)); // Persist change
            displayClientPODetails(poId); // Refresh the view
        }
    };

    const populateSupplierSelector = () => {
        const supplierEmails = [...new Set(dummyPOData.map(po => po.supplierEmail))];
        supplierSelect.innerHTML = '<option value="">-- Choose a Supplier --</option>'; // Reset
        supplierEmails.sort().forEach(email => {
            const option = document.createElement('option');
            option.value = email;
            const supplierUser = usersDB.find(u => u.email === email);
            option.textContent = supplierUser ? `${supplierUser.name} (${email})` : email;
            supplierSelect.appendChild(option);
        });
    };

    const getSupplierPerformanceData = (supplierEmail) => {
        const supplierPOs = dummyPOData.filter(po => po.supplierEmail === supplierEmail);
        const totalPOs = supplierPOs.length;

        const deliveredPOs = supplierPOs.filter(po => po.actualDeliveryDate);
        const onTimeDeliveries = deliveredPOs.filter(po => new Date(po.actualDeliveryDate) <= new Date(po.expectedDeliveryDate)).length;
        const totalDeliveries = deliveredPOs.length;
        const onTimeRate = totalDeliveries > 0 ? (onTimeDeliveries / totalDeliveries) * 100 : 100;

        const qualityApproved = supplierPOs.filter(po => po.qualityStatus === 'Approved').length;
        const qualityRejected = supplierPOs.filter(po => po.qualityStatus === 'Rejected').length;
        const qualityRatedPOs = qualityApproved + qualityRejected;
        const approvalRate = qualityRatedPOs > 0 ? (qualityApproved / qualityRatedPOs) * 100 : 100;

        const totalValue = supplierPOs.reduce((acc, po) => {
            return acc + po.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        }, 0);

        return {
            totalPOs,
            onTimeDeliveries,
            totalDeliveries,
            onTimeRate,
            qualityApproved,
            qualityRejected,
            approvalRate,
            totalValue
        };
    };

    async function handleSupplierAnalysis() {
        const selectedSupplier = supplierSelect.value;
        if (!selectedSupplier) {
            alert('Please select a supplier to analyze.');
            return;
        }

        analyzeSupplierBtn.disabled = true;
        analyzeSupplierBtn.textContent = 'Analyzing...';
        supplierSummary.innerHTML = 'AI is analyzing supplier data...';

        // 1. Use the new helper function to get performance data
        const performanceData = getSupplierPerformanceData(selectedSupplier);

        // 2. Create a detailed prompt for the AI
        const prompt = `
            You are an AI Supplier Performance Analyst. Based on the following data for the supplier, provide a concise summary of their performance. 
            Use bullet points for strengths and areas for improvement. Do not just list the data; interpret it.

            Data:
            - Total Purchase Orders: ${performanceData.totalPOs}
            - On-Time Delivery Rate: ${performanceData.onTimeRate.toFixed(1)}% (${performanceData.onTimeDeliveries} out of ${performanceData.totalDeliveries} delivered orders)
            - Quality Approval Rate: ${performanceData.approvalRate.toFixed(1)}% (${performanceData.qualityApproved} approved vs. ${performanceData.qualityRejected} rejected)
            - Total Business Value: $${performanceData.totalValue.toLocaleString()}
        `;

        try {
            const summary = await AIAgent._callAIProxy(prompt);
            supplierSummary.textContent = summary;
        } catch (error) {
            console.error("AI Analysis Error:", error);
            supplierSummary.textContent = 'An error occurred while communicating with the AI service. Please try again.';
        } finally {
            analyzeSupplierBtn.disabled = false;
            analyzeSupplierBtn.textContent = 'Analyze Performance';
        }
    }

    const populateRiskSupplierSelector = () => {
        const supplierEmails = [...new Set(dummyPOData.map(po => po.supplierEmail))];
        if (!riskSupplierSelect) return;
        riskSupplierSelect.innerHTML = '<option value="">-- Choose a Supplier --</option>'; // Reset
        supplierEmails.sort().forEach(email => {
            const option = document.createElement('option');
            option.value = email;
            const supplierUser = usersDB.find(u => u.email === email);
            option.textContent = supplierUser ? `${supplierUser.name} (${email})` : email;
            riskSupplierSelect.appendChild(option);
        });
    };

    async function handleRiskAssessment() {
        const selectedSupplier = riskSupplierSelect.value;
        if (!selectedSupplier) {
            alert('Please select a supplier to assess.');
            return;
        }

        assessRiskBtn.disabled = true;
        assessRiskBtn.textContent = 'Assessing...';
        riskAssessmentSummary.innerHTML = 'AI is analyzing supplier data for potential risks...';

        const performanceData = getSupplierPerformanceData(selectedSupplier);
        const supplierUser = usersDB.find(u => u.email === selectedSupplier);
        const supplierName = supplierUser ? supplierUser.name : selectedSupplier;

        const prompt = `
            You are an AI Supply Chain Risk Analyst. Your task is to assess the potential risks associated with a supplier based on their performance data.

            Supplier Name: ${supplierName}
            
            Performance Data:
            - Total Purchase Orders: ${performanceData.totalPOs}
            - On-Time Delivery Rate: ${performanceData.onTimeRate.toFixed(1)}%
            - Quality Approval Rate: ${performanceData.approvalRate.toFixed(1)}%
            - Total Business Value: $${performanceData.totalValue.toLocaleString()}

            Based on this data, analyze and report on the following potential risks:
            1.  **Operational Risk:** Is there a risk of delivery delays based on their on-time rate?
            2.  **Quality Risk:** Does their quality approval rate suggest a risk of receiving substandard parts?
            3.  **Concentration Risk:** Is the total business value high, suggesting over-reliance on this single supplier?

            Provide a summary for each risk category (Low, Medium, High) and give a brief justification. Conclude with a list of recommended mitigation strategies (e.g., "Increase safety stock," "Conduct a quality audit," "Identify alternative suppliers").
        `;

        try {
            const assessment = await AIAgent._callAIProxy(prompt);
            riskAssessmentSummary.textContent = assessment;
        } catch (error) {
            console.error("AI Risk Assessment Error:", error);
            riskAssessmentSummary.textContent = 'An error occurred while communicating with the AI service. Please try again.';
        } finally {
            assessRiskBtn.disabled = false;
            assessRiskBtn.textContent = 'Assess Potential Risks';
        }
    }

    const handleSupplierComparison = () => {
        const supplier1Email = supplier1Select.value;
        const supplier2Email = supplier2Select.value;
        const resultsContainer = comparisonResults;

        if (!supplier1Email || !supplier2Email) {
            alert('Please select two suppliers to compare.');
            resultsContainer.style.display = 'none';
            return;
        }

        if (supplier1Email === supplier2Email) {
            alert('Please select two different suppliers for comparison.');
            resultsContainer.style.display = 'none';
            return;
        }

        const data1 = getSupplierPerformanceData(supplier1Email);
        const data2 = getSupplierPerformanceData(supplier2Email);

        const supplier1User = usersDB.find(u => u.email === supplier1Email);
        const supplier2User = usersDB.find(u => u.email === supplier2Email);
        const name1 = supplier1User ? supplier1User.name : supplier1Email;
        const name2 = supplier2User ? supplier2User.name : supplier2Email;

        resultsContainer.innerHTML = `
            <h4>Comparison: ${name1} vs. ${name2}</h4>
            <div class="comparison-layout">
                <div class="chart-card">
                    <canvas id="comparison-chart"></canvas>
                </div>
                <div>
                    <table class="po-items-table">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>${name1}</th>
                                <th>${name2}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Total Purchase Orders</td>
                                <td>${data1.totalPOs}</td>
                                <td>${data2.totalPOs}</td>
                            </tr>
                            <tr>
                                <td>On-Time Delivery Rate</td>
                                <td>${data1.onTimeRate.toFixed(1)}%</td>
                                <td>${data2.onTimeRate.toFixed(1)}%</td>
                            </tr>
                            <tr>
                                <td>Quality Approval Rate</td>
                                <td>${data1.approvalRate.toFixed(1)}%</td>
                                <td>${data2.approvalRate.toFixed(1)}%</td>
                            </tr>
                            <tr>
                                <td>Total Business Value</td>
                                <td>$${data1.totalValue.toLocaleString()}</td>
                                <td>$${data2.totalValue.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        resultsContainer.style.display = 'block';

        // Render the new comparison chart
        const ctx = document.getElementById('comparison-chart').getContext('2d');
        if (comparisonChart) {
            comparisonChart.destroy();
        }
        comparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['On-Time Delivery Rate (%)', 'Quality Approval Rate (%)'],
                datasets: [
                    {
                        label: name1,
                        data: [data1.onTimeRate, data1.approvalRate],
                        backgroundColor: 'rgba(0, 90, 156, 0.6)', // Primary color
                        borderColor: 'rgba(0, 90, 156, 1)',
                        borderWidth: 1
                    },
                    {
                        label: name2,
                        data: [data2.onTimeRate, data2.approvalRate],
                        backgroundColor: 'rgba(253, 184, 19, 0.6)', // Accent color
                        borderColor: 'rgba(253, 184, 19, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Performance Metric Comparison' }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100, // Rates are percentages
                        ticks: { callback: value => value + '%' }
                    }
                }
            }
        });
    };

    const readFileAsText = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    };

    async function handleRFPComparison() {
        const file1 = rfpFile1Input.files[0];
        const file2 = rfpFile2Input.files[0];

        if (!file1 || !file2) {
            alert('Please upload both RFP documents to compare.');
            return;
        }

        compareRfpsBtn.disabled = true;
        compareRfpsBtn.textContent = 'Comparing...';
        rfpComparisonSummary.innerHTML = 'AI is reading and comparing the documents...';

        try {
            const [rfp1Text, rfp2Text] = await Promise.all([
                readFileAsText(file1),
                readFileAsText(file2)
            ]);

            const prompt = `
                You are an expert procurement analyst. Your task is to conduct a detailed comparison of the two Request for Proposal (RFP) documents provided below.

                Analyze and compare the documents based on the following key criteria:
                1.  **Scope of Work:** What are the primary goals and objectives? Are they clearly defined?
                2.  **Deliverables:** What specific outcomes, reports, or products are required?
                3.  **Timeline & Milestones:** What are the proposed deadlines and key milestones? Are they realistic?
                4.  **Technical Requirements:** What are the specific technical specifications or constraints?
                5.  **Evaluation Criteria:** How will the proposals be judged? What are the scoring metrics?
                6.  **Pricing Structure:** What format is requested for pricing (e.g., fixed-price, time and materials)?

                Present your analysis in a structured format. Use headings for each criterion. Conclude with a final summary highlighting the most significant differences, potential risks, and which RFP appears more detailed or favorable for a supplier to respond to.

                --- RFP 1: ${file1.name} ---
                ${rfp1Text}

                --- RFP 2: ${file2.name} ---
                ${rfp2Text}
            `;

            const comparison = await AIAgent._callAIProxy(prompt);
            rfpComparisonSummary.textContent = comparison;
        } catch (error) {
            console.error("RFP Comparison Error:", error);
            rfpComparisonSummary.textContent = 'An error occurred while comparing the RFPs. Please check the console for details and try again.';
        } finally {
            compareRfpsBtn.disabled = false;
            compareRfpsBtn.textContent = 'Compare RFPs';
        }
    }

    const resetDashboard = () => {
        poSearchInput.value = '';
        renderPOList();
    };

    const connectWebSocket = () => {
        // This function is disabled as there is no backend to connect to.
        console.log("WebSocket connection is disabled in this version.");
    };

    const initializeReportingModule = () => {
        try {
            // Calculate data locally from dummy data
            const allPOs = dummyPOData;
            const totalPOs = allPOs.length;
            
            const paidPOs = allPOs.filter(po => po.paymentProcessedDate);
            const totalTimeToPayment = paidPOs.reduce((acc, po) => {
                const orderDate = new Date(po.orderDate);
                const paymentDate = new Date(po.paymentProcessedDate);
                const diffTime = Math.abs(paymentDate - orderDate);
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                return acc + diffDays;
            }, 0);
            const avgTimeToPayment = paidPOs.length > 0 ? totalTimeToPayment / paidPOs.length : 0;

            const deliveredPOs = allPOs.filter(po => po.actualDeliveryDate);
            const onTime = deliveredPOs.filter(po => new Date(po.actualDeliveryDate) <= new Date(po.expectedDeliveryDate)).length;
            const delayed = deliveredPOs.length - onTime;
            
            const poValueByMonth = allPOs.reduce((acc, po) => {
                const month = new Date(po.orderDate).toLocaleString('default', { month: 'short', year: '2-digit' });
                const poValue = po.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
                if (!acc[month]) {
                    acc[month] = 0;
                }
                acc[month] += poValue;
                return acc;
            }, {});

            const data = {
                totalPOs,
                avgTimeToPayment,
                deliveryPerformance: { onTime, delayed },
                poValueByMonth
            };

            // Populate KPI Cards
            document.getElementById('total-pos-kpi').textContent = data.totalPOs;
            document.getElementById('avg-time-kpi').textContent = `${data.avgTimeToPayment.toFixed(1)} Days`;
            
            const totalDeliveries = data.deliveryPerformance.onTime + data.deliveryPerformance.delayed;
            const onTimePercentage = totalDeliveries > 0 ? (data.deliveryPerformance.onTime / totalDeliveries) * 100 : 0;
            document.getElementById('on-time-kpi').textContent = `${onTimePercentage.toFixed(0)}%`;

            // Render Chart
            renderDeliveryChart(data.deliveryPerformance);
            renderPOValueChart(data.poValueByMonth);

        } catch (error) {
            console.error("Error initializing reporting module:", error);
        }
    };

    const renderDeliveryChart = (deliveryData) => {
        const ctx = document.getElementById('delivery-chart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['On-Time Deliveries', 'Delayed Deliveries'],
                datasets: [{
                    label: 'Delivery Performance',
                    data: [deliveryData.onTime, deliveryData.delayed],
                    backgroundColor: [
                        '#28a745', // success-color
                        '#dc3545'  // danger-color
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Delivery Performance Overview' }
                }
            }
        });
    };

    const renderPOValueChart = (poValueData) => {
        const ctx = document.getElementById('po-value-chart').getContext('2d');
        const labels = Object.keys(poValueData);
        const data = Object.values(poValueData);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total PO Value ($)',
                    data: data,
                    backgroundColor: 'rgba(0, 90, 156, 0.6)',
                    borderColor: 'rgba(0, 90, 156, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Monthly PO Value' }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { callback: value => '$' + value }
                    }
                }
            }
        });
    };

    const renderPOList = (searchTerm = '') => {
        poListContainer.innerHTML = '';
        // When the list is re-rendered (e.g., after a search), reset the details panel.
        poDetailsContent.innerHTML = '<p class="placeholder-text">Select a Purchase Order to view details.</p>';
        qualityClearanceContainer.innerHTML = '';

        const filteredPOs = searchTerm 
            ? dummyPOData.filter(po => po.id.toLowerCase().includes(searchTerm.toLowerCase()))
            : dummyPOData;

        purchaseOrders = filteredPOs; // Update local cache

        if (filteredPOs.length === 0) {
            poListContainer.innerHTML = '<p>No purchase orders found.</p>';
            poDetailsContent.innerHTML = '<p class="placeholder-text">Select a Purchase Order to view details.</p>';
            return;
        }

        filteredPOs.forEach(po => {
            const poItem = document.createElement('div');
            poItem.className = 'po-list-item';
            poItem.dataset.poId = po.id;
            poItem.innerHTML = `<strong>${po.id}</strong><br><span>Status: ${po.status}</span>`;
            poItem.addEventListener('click', () => {
                // Highlight active item
                document.querySelectorAll('.po-list-item.active').forEach(item => item.classList.remove('active'));
                poItem.classList.add('active');
                displayPODetails(po.id);
            });
            poListContainer.appendChild(poItem);
        });

        // If only one PO is found, automatically select and display its details.
        if (filteredPOs.length === 1) {
            poListContainer.querySelector('.po-list-item').click();
        }
    };

    const displayPODetails = (poId) => {
        const po = purchaseOrders.find(p => p.id === poId);
        // Clear previous state when a new PO is selected
        qualityClearanceContainer.innerHTML = '';
        selectedFiles = [];

        if (!po) return;

        let actionButtons = '';
        if (po.status === 'Pending Acceptance') {
            actionButtons = `
                <div class="po-actions" style="margin-top: 15px;">
                    <button class="btn btn-success" onclick="handleSupplierPOAction('${po.id}', 'Processing')">Accept PO</button>
                    <button class="btn btn-danger" onclick="handleSupplierPOAction('${po.id}', 'Rejected')">Reject PO</button>
                </div>
            `;
        }

        let itemsHtml = po.items.map(item => {
            return `
                <tr data-item-id="${item.id}" data-item-name="${item.name}">
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.status}</td>
                    <td><button class="btn btn-track" data-item-id="${item.id}" data-item-name="${item.name}">Track</button></td>
                </tr>
            `;
        }).join('');

        poDetailsContent.innerHTML = `
            <div class="po-details-header">
                <h3>Details for ${po.id}</h3>
                <p><strong>Client:</strong> ${po.client} | <strong>Date:</strong> ${new Date(po.orderDate).toLocaleDateString()} | <strong>Overall Status:</strong> ${po.status}</p>
                ${actionButtons}
            </div>
            <table class="po-items-table">
                <thead>
                    <tr><th>Item ID</th><th>Item Name</th><th>Quantity</th><th>Current Status</th><th>Actions</th></tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
            </table>
        `;

        // Add event listeners to the new track buttons
        poDetailsContent.querySelectorAll('.btn-track').forEach(button => {
            button.addEventListener('click', (e) => {
                // Stop any previous simulation before starting a new one
                if (activeTrackingInterval) clearInterval(activeTrackingInterval);
                const itemId = e.target.dataset.itemId;
                const itemName = e.target.dataset.itemName;
                displayItemTracking(itemId, itemName);
            });
        });

        // Render the quality clearance workflow section
        renderQualityClearanceWorkflow(po);
    };

    const renderTrackingTimeline = (itemId) => {
        // 1. Find the parent PO for the given item
        const parentPO = dummyPOData.find(po => po.items.some(item => item.id === itemId));
        if (!parentPO) {
            trackingTimeline.innerHTML = '<p>Could not find associated Purchase Order.</p>';
            return;
        }

        // 2. Start with the basic logistics history
        let combinedTimeline = [...(dummyItemTrackingData[itemId] || [])];

        // 3. Dynamically add post-delivery steps based on the PO's data
        const deliveryDate = parentPO.actualDeliveryDate ? new Date(parentPO.actualDeliveryDate) : null;

        if (deliveryDate && (parentPO.qualityStatus === 'Approved' || parentPO.qualityStatus === 'Rejected')) {
            const clearanceDate = new Date(deliveryDate);
            clearanceDate.setDate(clearanceDate.getDate() + 1); // Simulate 1 day for clearance
            combinedTimeline.push({
                status: `Quality Clearance: ${parentPO.qualityStatus}`,
                location: 'Quality Dept.',
                timestamp: clearanceDate.toISOString()
            });
        }

        if (deliveryDate && parentPO.qualityStatus === 'Approved') {
            const grnDate = new Date(deliveryDate);
            grnDate.setDate(grnDate.getDate() + 2); // Simulate 2 days for GRN
            combinedTimeline.push({
                status: 'GRN Created',
                location: 'Warehouse/Stores',
                timestamp: grnDate.toISOString()
            });
        }

        if (parentPO.paymentProcessedDate) {
            const paymentDate = new Date(parentPO.paymentProcessedDate);
            const invoiceDate = new Date(paymentDate);
            invoiceDate.setDate(paymentDate.getDate() - 5); // Simulate invoice received 5 days before payment
            const processingDate = new Date(paymentDate);
            processingDate.setDate(paymentDate.getDate() - 2); // Simulate processing 2 days before payment

            combinedTimeline.push({ status: 'Invoice Processing', location: 'Finance Dept.', timestamp: invoiceDate.toISOString() });
            combinedTimeline.push({ status: 'Payment Processing', location: 'Finance Dept.', timestamp: processingDate.toISOString() });
            combinedTimeline.push({ status: `Payment Made (Ref: ${parentPO.transactionId})`, location: 'Bank', timestamp: paymentDate.toISOString() });
        }

        // 4. Sort the entire timeline by date to ensure correct order
        combinedTimeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // 5. Render the final, complete timeline
        if (combinedTimeline.length === 0) {
            trackingTimeline.innerHTML = '<p>No tracking information available for this item.</p>';
        } else {
            const reversedSteps = [...combinedTimeline].reverse();
            trackingTimeline.innerHTML = reversedSteps.map(step => `
                <div class="timeline-item">
                    <div class="timeline-item-content">
                        <strong>${step.status}</strong>
                        <p style="margin: 4px 0 0; color: #555;">${step.location}</p>
                        <small style="color: #777;">${new Date(step.timestamp).toLocaleString()}</small>
                    </div>
                </div>
            `).join('');
        }
    };

    const displayItemTracking = async (itemId, itemName) => {
        trackingItemName.textContent = `${itemName} (${itemId}) - Simulating...`;
        
        renderTrackingTimeline(itemId);

        itemTrackingModal.style.display = 'flex';
        startRealTimeTracking(itemId); // Start the simulation when the modal opens
    };

    // --- 8. Modal Close Logic ---
    const closeModal = () => {
        if (activeTrackingInterval) {
            clearInterval(activeTrackingInterval); // Stop the simulation when modal is closed
            activeTrackingInterval = null;
        }
        itemTrackingModal.style.display = 'none';
    };

    closeButton.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target == itemTrackingModal) {
            closeModal();
        }
    });

    // --- 9. Real-Time Tracking Simulation Logic ---
    const startRealTimeTracking = (itemId) => {
        activeTrackingInterval = setInterval(() => {
            let poToUpdate;
            let itemToUpdate;

            // Find the PO and the specific item in our dummy database
            for (const po of dummyPOData) {
                const foundItem = po.items.find(item => item.id === itemId);
                if (foundItem) {
                    poToUpdate = po;
                    itemToUpdate = foundItem;
                    break;
                }
            }

            if (!itemToUpdate) {
                clearInterval(activeTrackingInterval);
                return;
            }

            const currentStatusIndex = statusSequence.indexOf(itemToUpdate.status);
            
            // If the item is not at the end of the sequence, advance its status
            if (currentStatusIndex > -1 && currentStatusIndex < statusSequence.length - 1) {
                const nextStatus = statusSequence[currentStatusIndex + 1];
                itemToUpdate.status = nextStatus;

                // Add to the tracking history if it exists
                if (dummyItemTrackingData[itemId]) {
                    dummyItemTrackingData[itemId].push({
                        status: nextStatus,
                        location: "Simulated Update",
                        timestamp: new Date().toISOString()
                    });
                }

                // If all items are now delivered, update the main PO status
                if (poToUpdate.items.every(i => i.status === 'Delivered')) {
                    poToUpdate.status = 'Delivered';
                    // Set the actual delivery date if it's not already set
                    if (!poToUpdate.actualDeliveryDate) {
                        poToUpdate.actualDeliveryDate = new Date().toISOString();
                    }
                }

                // Persist the changes so they are visible to the client
                localStorage.setItem('dummyPOData', JSON.stringify(dummyPOData));

                // Refresh the UI to show the change
                displayPODetails(poToUpdate.id);
                renderTrackingTimeline(itemId); // Refresh the modal timeline
            } else {
                // Stop the simulation if the item is 'Delivered' or has an unknown status
                clearInterval(activeTrackingInterval);
                trackingItemName.textContent = `${itemToUpdate.name} (${itemToUpdate.id}) - Final Status`;
            }
        }, 3000); // Update status every 3 seconds
    };

    // --- 10. Quality Clearance Workflow Logic ---
    const renderQualityClearanceWorkflow = (po) => {
        // This section shows the LIVE status from the DQC app
        const qualityStatuses = JSON.parse(localStorage.getItem('dqcProductStatuses')) || {};

        let relevantFeedback = '';
        let overallStatus = 'Approved'; // Start with an optimistic assumption

        // First, check if any item from this PO has been processed by the DQC app.
        // If not, there's no quality status to show for this PO.
        const poItemsInDQC = po.items.some(item => qualityStatuses[item.id]);
        if (!poItemsInDQC) {
            qualityClearanceContainer.innerHTML = '';
            return;
        }

        // Pass 1: Check for rejections. This is the highest priority status.
        for (const item of po.items) {
            const itemInfo = qualityStatuses[item.id];
            if (itemInfo && itemInfo.status === 'Rejected') {
                overallStatus = 'Rejected';
                if (itemInfo.comments) {
                    relevantFeedback = itemInfo.comments;
                }
                break; // A single rejection is definitive.
            }
        }

        // Pass 2: If no rejections were found, check for pending items.
        if (overallStatus !== 'Rejected') {
            for (const item of po.items) {
                const itemInfo = qualityStatuses[item.id];
                // An item is considered pending if its status is 'Pending' or if it hasn't been processed by DQC yet.
                if (!itemInfo || itemInfo.status === 'Pending') {
                    overallStatus = 'Pending';
                    break; // A single pending item makes the overall status Pending.
                }
            }
        }

        // If the status is still 'Approved', it means no items were rejected and none were pending.
        // We can now look for the first available comment from an approved item.
        if (overallStatus === 'Approved') {
            for (const item of po.items) {
                const itemInfo = qualityStatuses[item.id];
                if (itemInfo && itemInfo.comments) {
                    relevantFeedback = itemInfo.comments;
                    break;
                }
            }
        }

        // This section controls the SUPPLIER's actions and workflow state
        const statusClass = overallStatus.toLowerCase().replace(/ /g, '-');
        let content = `
            <h4>Quality Clearance Status</h4>
            <div class="quality-status-display">
                <span>Overall Status:</span>
                <span class="quality-status-badge ${statusClass}">${overallStatus}</span>
            </div>
        `;
    
        if (relevantFeedback) {
            content += `
                <div class="feedback-box">
                    <strong>Latest Remarks from DQC:</strong>
                    <p>${relevantFeedback}</p>
                </div>
            `;
        }
    
        qualityClearanceContainer.innerHTML = `<div class="quality-clearance-container">${content}</div>`;
    };

    const handleFileSelection = (event) => {
        // Since we are uploading one specific document type, we can simplify this
        selectedFiles = []; // Clear previous selections
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            selectedFiles.push({ file: file, type: 'Quality Certificate' });
        }
        renderFilePreviews();
        event.target.value = ''; // Allow selecting the same file again if removed
    };

    const renderFilePreviews = () => {
        const previewList = document.getElementById('file-preview-list');
        const submitBtn = document.getElementById('submit-docs-btn');
        if (!previewList || !submitBtn) return;

        previewList.innerHTML = '';

        selectedFiles.forEach(fileObj => {
            const item = document.createElement('div');
            item.className = 'file-preview-item';
            item.innerHTML = `<span>${fileObj.file.name}</span><button class="remove-file-btn" data-filename="${fileObj.file.name}">&times;</button>`;
            item.querySelector('.remove-file-btn').addEventListener('click', (e) => {
                const filenameToRemove = e.target.dataset.filename;
                selectedFiles = selectedFiles.filter(f => f.file.name !== filenameToRemove);
                renderFilePreviews(); // Re-render the list
            });
            previewList.appendChild(item);
        });

        // Show or hide the submit button based on whether files are selected
        submitBtn.style.display = selectedFiles.length > 0 ? 'inline-block' : 'none';
    };

    const handleDocumentUpload = (poId) => {
        if (selectedFiles.length === 0) {
            alert('Please select a file to upload.');
            return;
        }

        const progressContainer = document.getElementById('upload-progress-container');
        progressContainer.innerHTML = 'Starting upload...';

        const uploadPromises = selectedFiles.map(fileObj => {
            return new Promise((resolve, reject) => {
                const file = fileObj.file;
                const filePath = `documents/${poId}/${file.name}`;
                const storageRef = storage.ref(filePath);
                const uploadTask = storageRef.put(file);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        progressContainer.innerHTML = `Uploading ${file.name}: ${Math.round(progress)}%`;
                    },
                    (error) => reject(error),
                    () => {
                        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                            // Simulate backend update by modifying the local dummy data
                            console.log('Simulating backend update for document upload.');
                            const po = purchaseOrders.find(p => p.id === poId);
                            if (po) {
                                if (!po.documents) po.documents = [];
                                po.documents.push({ documentName: file.name, documentUrl: downloadURL, documentType: fileObj.type });
                                
                                // If a quality doc is uploaded, change the status
                                if (fileObj.type === 'Quality Certificate') {
                                    po.qualityStatus = 'Pending Approval';
                                    po.qualityFeedback = '';
                                }
                                displayPODetails(poId); // Re-render the details panel to show the changes
                            }
                            resolve();
                        }).catch(reject);
                    }
                );
            });
        });

        Promise.all(uploadPromises)
            .then(() => {
                alert('Document submitted for approval successfully!');
                // The UI will be updated automatically by the WebSocket message.
            })
            .catch(error => {
                console.error("Error during upload:", error);
                progressContainer.innerHTML = `<p style="color: var(--danger-color);">An error occurred: ${error.message}</p>`;
            });
    };

    // --- Integration Helper & Listener ---

    const getQualityStatusBadge = (status) => {
        if (!status) {
            status = 'Pending'; // Default if no status is found
        }
        const statusClass = status.toLowerCase();
        return `<span class="quality-status-badge ${statusClass}">${status}</span>`;
    };

    // Listen for real-time updates from the DQC app
    window.addEventListener('storage', (e) => {
        if (e.key === 'dqcProductStatuses') {
            console.log('Quality statuses updated from DQC app.');

            // If a PO is currently being viewed, re-render its quality clearance section
            const activePOItem = document.querySelector('.po-list-item.active');
            if (activePOItem) {
                const poId = activePOItem.dataset.poId;
                const po = purchaseOrders.find(p => p.id === poId);
                if (po) {
                    renderQualityClearanceWorkflow(po);
                }
            }
        }
    });

    // --- Initial Load ---
    const init = () => {
        loginForm.addEventListener('submit', handleLogin);
        registerForm.addEventListener('submit', handleRegister);
        supplierLogoutBtn.addEventListener('click', handleLogout);
        clientLogoutBtn.addEventListener('click', handleLogout);
        
        // --- View Switching Logic ---
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            showView('register-view');
        });
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showView('login-view');
        });

        checkLoginState();
    };

    init();
});