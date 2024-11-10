document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keyup', function() {
      const searchText = this.value.toLowerCase();
      const rows = document.getElementsByClassName('searchable-row');
      let visibleIndex = 1;
      
      Array.from(rows).forEach(row => {
        const text = row.children[1].textContent.toLowerCase();
        if (text.includes(searchText)) {
          row.style.display = '';
          row.children[0].textContent = visibleIndex++;
        } else {
          row.style.display = 'none';
        }
      });
    });
  }
});

async function desactivarEspecialidad(id) {
  try {
    const response = await fetch(`/medicos/especialidad/toggle/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      window.location.reload();
    } else {
      console.error('Error al cambiar el estado');
    }
  } catch (error) {
    console.error('Error:', error);
  }
} 