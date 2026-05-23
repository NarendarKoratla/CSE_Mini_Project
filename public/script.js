const API_URL = 'http://localhost:5000/api';

// Hardcoded teachers list (in a real app, this might come from DB too)
const teachersList = {
    '1-CSE': ['Anusha', 'Prasad', 'Sandeep', 'Jyothi', 'Varma'],
    '1-ECE': ['Suresh', 'Mahesh', 'Mukesh', 'Rajesh', 'Rakesh'],
    '1-EEE': ['Ganesh', 'Nagesh', 'Ramesh', 'Raju', 'Rani'],
    '2-CSE': ['Bhanu', 'Bhavya', 'Uma', 'Sai', 'Raghu'],
    '2-ECE': ['Sohail', 'Chand', 'Pasha', 'Roushan', 'Harshitha'],
    '2-EEE': ['Bhavitha', 'Geetha', 'Karthik', 'Sahil', 'Aman'],
    '3-CSE': ['Umesh', 'Sanjay', 'Narendar', 'Abhi', 'Venkat'],
    '3-ECE': ['Pavan', 'Sarhya', 'Sai', 'Balaji', 'Padma'],
    '3-EEE': ['Madhav', 'Nagaraju', 'Rama', 'Chary', 'Naseer'],
    '4-CSE': ['Anjali', 'Laya', 'Blessy', 'Pooja', 'Mounika'],
    '4-ECE': ['Prudhvi', 'Madhuri', 'Manisha', 'Navya', 'Bhagyasri'],
    '4-EEE': ['Charan', 'Krishna', 'Prashanth', 'Naresh', 'Kumar']
};

let currentUser = null;

// UI State Management
function showPage(pageId) {
    document.querySelectorAll('.glass-container').forEach(el => el.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';
    if (isError) toast.classList.add('error');
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Event Listeners for navigation
document.getElementById('registerLink').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('registrationPage');
});

document.getElementById('loginLink').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('loginPage');
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    currentUser = null;
    document.getElementById('loginForm').reset();
    showPage('loginPage');
    showToast('Logged out successfully');
});

// Registration
document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.textContent = 'Registering...';
    
    const payload = {
        studentName: document.getElementById('studentName').value,
        username: document.getElementById('regUsername').value,
        password: document.getElementById('regPassword').value,
        email: document.getElementById('email').value,
        dob: document.getElementById('dob').value,
        year: document.getElementById('year').value,
        course: document.getElementById('course').value,
    };

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (res.ok) {
            showToast('Registration Successful! Please login.');
            document.getElementById('registrationForm').reset();
            showPage('loginPage');
        } else {
            document.getElementById('regError').textContent = data.message;
            document.getElementById('regError').style.display = 'block';
        }
    } catch (err) {
        showToast('Server error. Please try again later.', true);
    } finally {
        btn.textContent = 'Register Now';
    }
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.textContent = 'Logging in...';

    const payload = {
        username: document.getElementById('loginUsername').value,
        password: document.getElementById('loginPassword').value,
    };

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok) {
            currentUser = data.user;
            document.getElementById('loginError').style.display = 'none';
            showToast('Login Successful!');
            generateFeedbackForm();
            showPage('feedbackPage');
        } else {
            document.getElementById('loginError').textContent = data.message;
            document.getElementById('loginError').style.display = 'block';
        }
    } catch (err) {
        showToast('Server error. Please try again later.', true);
    } finally {
        btn.textContent = 'Login';
    }
});

// Generate Feedback Form Dynamically
function generateFeedbackForm() {
    const yearCourse = `${currentUser.year}-${currentUser.course}`;
    const teachers = teachersList[yearCourse];
    
    document.getElementById('feedbackSubtitle').textContent = `Evaluating teachers for ${currentUser.year} Year ${currentUser.course}`;
    
    const container = document.getElementById('teachersFeedbackContainer');
    container.innerHTML = '';

    if (!teachers) {
        container.innerHTML = '<p>No teachers found for this course.</p>';
        return;
    }

    teachers.forEach(teacher => {
        const card = document.createElement('div');
        card.className = 'teacher-card';
        card.innerHTML = `
            <h3>👩‍🏫 ${teacher}</h3>
            <div class="rating-row">
                <label>Interaction</label>
                <input type="number" min="1" max="5" required id="interaction-${teacher}" placeholder="1-5">
            </div>
            <div class="rating-row">
                <label>Subject</label>
                <input type="number" min="1" max="5" required id="subject-${teacher}" placeholder="1-5">
            </div>
            <div class="rating-row">
                <label>Examples Usage</label>
                <input type="number" min="1" max="5" required id="examples-${teacher}" placeholder="1-5">
            </div>
            <div class="rating-row">
                <label>Explanation</label>
                <input type="number" min="1" max="5" required id="explanation-${teacher}" placeholder="1-5">
            </div>
            <div class="suggestion-group">
                <label>Suggestion for ${teacher}:</label>
                <textarea id="suggestion-${teacher}" rows="2" placeholder="Any specific feedback?"></textarea>
            </div>
        `;
        container.appendChild(card);
    });
}

// Submit Feedback
document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.textContent = 'Submitting...';

    const yearCourse = `${currentUser.year}-${currentUser.course}`;
    const teachers = teachersList[yearCourse] || [];
    
    const teacherData = teachers.map(teacher => {
        const interaction = parseInt(document.getElementById(`interaction-${teacher}`).value);
        const subject = parseInt(document.getElementById(`subject-${teacher}`).value);
        const examples = parseInt(document.getElementById(`examples-${teacher}`).value);
        const explanation = parseInt(document.getElementById(`explanation-${teacher}`).value);
        const suggestion = document.getElementById(`suggestion-${teacher}`).value;
        
        return {
            teacher,
            interaction,
            subject,
            examples,
            explanation,
            suggestion,
            totalRating: (interaction + subject + examples + explanation) / 4
        };
    });

    const payload = {
        userId: currentUser.id,
        yearCourse: yearCourse,
        teacherData: teacherData
    };

    try {
        const res = await fetch(`${API_URL}/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            showToast('Feedback submitted successfully!');
            document.getElementById('feedbackForm').reset();
            await fetchAndDisplayResults(yearCourse);
            showPage('resultsPage');
        } else {
            showToast('Failed to submit feedback.', true);
        }
    } catch (err) {
        showToast('Server error.', true);
    } finally {
        btn.textContent = 'Submit Feedback';
    }
});

// Fetch and Display Results
async function fetchAndDisplayResults(yearCourse) {
    document.getElementById('resultsSubtitle').textContent = `Overall performance for ${yearCourse}`;
    
    try {
        const res = await fetch(`${API_URL}/results/${yearCourse}`);
        const data = await res.json();
        
        const tbody = document.getElementById('resultsTableBody');
        tbody.innerHTML = '';
        
        const suggestionList = document.getElementById('suggestionList');
        suggestionList.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No feedback recorded yet.</td></tr>';
            return;
        }

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item._id}</td>
                <td><strong>${item.avgTotalRating.toFixed(1)} / 5</strong></td>
                <td>${item.feedbacksCount}</td>
            `;
            tbody.appendChild(row);

            // Add non-empty suggestions
            item.suggestions.forEach(sugg => {
                if (sugg && sugg.trim() !== '') {
                    const li = document.createElement('li');
                    li.textContent = `(${item._id}) "${sugg}"`;
                    suggestionList.appendChild(li);
                }
            });
        });
        
        if (suggestionList.children.length === 0) {
            suggestionList.innerHTML = '<li>No suggestions provided yet.</li>';
        }

    } catch (err) {
        showToast('Failed to load results.', true);
    }
}
