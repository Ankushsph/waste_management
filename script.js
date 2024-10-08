document.addEventListener('DOMContentLoaded', function() {
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const wasteForm = document.getElementById('waste-form');
    const distributorForm = document.getElementById('distributor-form');
    
    // Show Sign-Up and Login forms
    showSignup.addEventListener('click', function() {
        document.getElementById('auth-options').style.display = 'none';
        document.getElementById('signup').style.display = 'block';
    });

    showLogin.addEventListener('click', function() {
        document.getElementById('auth-options').style.display = 'none';
        document.getElementById('login').style.display = 'block';
    });

    // Sign-up form submission
    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        try {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();
            if (result.success) {
                alert('Sign-up successful! Please log in.');
                document.getElementById('signup').style.display = 'none';
                document.getElementById('login').style.display = 'block';
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error signing up:', error);
        }
    });

    // Login form submission
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();
            if (result.success) {
                document.getElementById('login').style.display = 'none';
                document.getElementById('role-selection').style.display = 'block';
            } else {
                document.getElementById('login-error').style.display = 'block';
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    });

    // Role selection
    document.getElementById('distributor-btn').addEventListener('click', function() {
        document.getElementById('role-selection').style.display = 'none';
        document.getElementById('waste-selection').style.display = 'block';
    });

    document.getElementById('collector-btn').addEventListener('click', function() {
        document.getElementById('role-selection').style.display = 'none';
        document.getElementById('collector-info').style.display = 'block';
        loadDistributorInfo();
    });

    // Waste selection form submission
    wasteForm.addEventListener('submit', function(event) {
        event.preventDefault();
        document.getElementById('waste-selection').style.display = 'none';
        document.getElementById('distributor-info').style.display = 'block';
    });

    // Distributor form submission
    distributorForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const name = document.getElementById('dist-name').value;
        const address = document.getElementById('dist-address').value;
        const phone = document.getElementById('dist-phone').value;
        
        try {
            const response = await fetch('http://localhost:3000/api/distributors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, address, phone })
            });
            const result = await response.json();
            if (result.success) {
                alert('Information submitted successfully!');
                document.getElementById('distributor-info').style.display = 'none';
                document.getElementById('role-selection').style.display = 'block';
            } else {
                alert('Error adding information. Please try again.');
            }
        } catch (error) {
            console.error('Error adding distributor:', error);
        }
    });

    // Load distributor info for collectors
    async function loadDistributorInfo() {
        const distributorList = document.getElementById('distributor-list');
        distributorList.innerHTML = '';

        try {
            const response = await fetch('http://localhost:3000/api/distributors');
            const distributors = await response.json();
            distributors.forEach(distributor => {
                const distributorItem = `
                    <p><strong>Name:</strong> ${distributor.name}</p>
                    <p><strong>Address:</strong> ${distributor.address}</p>
                    <p><strong>Phone:</strong> ${distributor.phone}</p>
                    <hr>
                `;
                distributorList.innerHTML += distributorItem;
            });
        } catch (error) {
            console.error('Error getting distributors list:', error);
        }
    }
});
