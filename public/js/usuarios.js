document.getElementById('searchInput').addEventListener('keyup', function() {
  const searchText = this.value.toLowerCase();
  const rows = document.getElementsByClassName('searchable-row');
  let visibleIndex = 1;
  
  Array.from(rows).forEach(row => {
    const nombre = row.children[2].textContent.toLowerCase();
    const apellido = row.children[3].textContent.toLowerCase();
    const username = row.children[4].textContent.toLowerCase();
    const tipo = row.children[5].textContent.toLowerCase();
    
    if (nombre.includes(searchText) || 
        apellido.includes(searchText) || 
        username.includes(searchText) || 
        tipo.includes(searchText)) {
      row.style.display = '';
      row.children[0].textContent = visibleIndex++;
    } else {
      row.style.display = 'none';
    }
  });
});

async function toggleUserStatus(userId, newStatus) {
  if (confirm('¿Está seguro de cambiar el estado de este usuario?')) {
    try {
      const response = await fetch(`/usuarios/toggle-status/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: newStatus })
      });
      
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
} 