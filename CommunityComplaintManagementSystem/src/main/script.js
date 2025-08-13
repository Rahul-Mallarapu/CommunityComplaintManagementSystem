const API_BASE = 'http://localhost:8080/api';

let currentUser = null; // Will hold { username, token }

// Show message helper
function showMessage(msg, isError = false) {
    const msgDiv = document.getElementById('message');
    msgDiv.style.color = isError ? 'red' : 'green';
    msgDiv.textContent = msg;
    setTimeout(() => { msgDiv.textContent = ''; }, 4000);
}

// Show/hide forms
function showLoginForm() {
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('registerFormContainer').style.display = 'none';
    document.getElementById('complaintSection').style.display = 'none';
}
function showRegisterForm() {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('registerFormContainer').style.display = 'block';
    document.getElementById('complaintSection').style.display = 'none';
}
function showComplaintSection() {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('registerFormContainer').style.display = 'none';
    document.getElementById('complaintSection').style.display = 'block';
}

// Toggle links
document.getElementById('showRegister').addEventListener('click', showRegisterForm);
document.getElementById('showLogin').addEventListener('click', showLoginForm);

// Registration form submit
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const address = document.getElementById('regAddress').value.trim();
    const age = document.getElementById('regAge').value;
    const gender = document.getElementById('regGender').value;
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;

    if(!name || !address || !age || !gender || !email || !password) {
        showMessage('Please fill all fields', true);
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, address, age, gender, email, password})
        });
        if(res.ok) {
            showMessage('Registration successful! Please login.');
            this.reset();
            showLoginForm();
        } else {
            const err = await res.text();
            showMessage('Registration failed: ' + err, true);
        }
    } catch (err) {
        showMessage('Error: ' + err.message, true);
    }
});

// Login form submit
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if(!username || !password) {
        showMessage('Enter username and password', true);
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });

        if(res.ok) {
            const data = await res.json();
            currentUser = data; // expected to have token and user info
            showMessage('Login successful');
            this.reset();
            showComplaintSection();
            loadComplaints();
        } else {
            const err = await res.text();
            showMessage('Login failed: ' + err, true);
        }
    } catch (err) {
        showMessage('Error: ' + err.message, true);
    }
});

// Logout button
document.getElementById('logoutBtn').addEventListener('click', function() {
    currentUser = null;
    showLoginForm();
    showMessage('Logged out');
});

// Submit complaint form
document.getElementById('complaintForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    if(!currentUser || !currentUser.token) {
        showMessage('Please login first', true);
        return;
    }

    const category = document.getElementById('category').value;
    const location = document.getElementById('location').value.trim();
    const description = document.getElementById('description').value.trim();

    if(!category || !location || !description) {
        showMessage('Please fill all complaint fields', true);
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/complaints`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
            },
            body: JSON.stringify({category, location, description})
        });

        if(res.ok) {
            showMessage('Complaint submitted successfully');
            this.reset();
            loadComplaints();
        } else {
            const err = await res.text();
            showMessage('Failed to submit complaint: ' + err, true);
        }
    } catch (err) {
        showMessage('Error: ' + err.message, true);
    }
});

// Load complaints for logged-in user
async function loadComplaints() {
    if(!currentUser || !currentUser.token) return;

    try {
        const res = await fetch(`${API_BASE}/complaints/my`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });

        const container = document.getElementById('complaintsList');
        container.innerHTML = '';

        if(res.ok) {
            const complaints = await res.json();

            if(complaints.length === 0) {
                container.textContent = 'No complaints submitted yet.';
                return;
            }

            complaints.forEach(c => {
                const div = document.createElement('div');
                div.className = 'complaint-item';
                div.innerHTML = `
                  <strong>Category:</strong> ${c.category}<br/>
                  <strong>Location:</strong> ${c.location}<br/>
                  <strong>Description:</strong> ${c.description}<br/>
                  <strong>Status:</strong> <span class="status-${c.status.toLowerCase()}">${c.status}</span>
                `;
                container.appendChild(div);
            });
        } else {
            const err = await res.text();
            showMessage('Failed to load complaints: ' + err, true);
        }
    } catch(err) {
        showMessage('Error: ' + err.message, true);
    }
}

// Initially show login form
showLoginForm();
