// Function to fetch all users
function fetchUsers() {
    fetch('/users')
      .then(response => response.json())
      .then(users => {
        const userTableBody = document.getElementById('user-table-body');
        userTableBody.innerHTML = '';
  
        users.forEach(user => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
              <button onclick="showEditForm(${user.id}, '${user.name}', '${user.email}')">Edit</button>
              <button onclick="deleteUser(${user.id})">Delete</button>
            </td>
          `;
          userTableBody.appendChild(row);
        });
      })
      .catch(error => console.error('Error fetching users:', error));
  }
  
  // Function to create a new user
  function createUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
      
    if (!name || !email) {
      return;
      }
  
    fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email })
    })
      .then(response => response.text())
      .then(result => {
        console.log(result);
        fetchUsers();
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
      })
      .catch(error => console.error('Error creating user:', error));
  }
  
  // Function to show the edit form
  function showEditForm(userId, name, email) {
    const editForm = document.getElementById('edit-form');
    editForm.style.display = 'block';
  
    document.getElementById('edit-id').value = userId;
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-email').value = email;
  }
  
  // Function to edit a user
  function editUser() {
    const userId = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    
    if (!name || !email) {
        return; // Do not proceed if name or email is empty
      }
  
    fetch(`/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email })
    })
      .then(response => response.text())
      .then(result => {
        console.log(result);
        fetchUsers();
        document.getElementById('edit-form').style.display = 'none';
      })
      .catch(error => console.error('Error editing user:', error));
  }
  
  // Function to delete a user
  function deleteUser(userId) {
    fetch(`/users/${userId}`, {
      method: 'DELETE'
    })
      .then(response => response.text())
      .then(result => {
        console.log(result);
        fetchUsers();
      })
      .catch(error => console.error('Error deleting user:', error));
  }
  
// Event listener for input fields
document.getElementById('name').addEventListener('input', validateForm);
document.getElementById('email').addEventListener('input', validateForm);

// Function to validate the form
function validateForm() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const createBtn = document.getElementById('create-btn');

  if (name && email) {
    createBtn.disabled = false; // Enable the "Create" button if both fields are filled
  } else {
    createBtn.disabled = true; // Disable the "Create" button if any field is empty
  }
}

  // Fetch users when the page loads
  fetchUsers();
  