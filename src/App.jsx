const base_color = "#965252";

function App() {
  return (
    <div>
      <h1>Spy Game</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '20px', margin: '20px' }}>

      {[1, 2, 3, 4, 5, 6].map(i => 
        <div style={{ backgroundColor: base_color, padding: '20px', borderRadius: '5px' }}>Item {i}</div>
      )}






{/*
        <div style={{ backgroundColor: base_color, padding: '20px', borderRadius: '5px' }}>Item 1</div>
        <div style={{ backgroundColor: base_color, padding: '20px', borderRadius: '5px' }}>Item 2</div>
        <div style={{ backgroundColor: base_color, padding: '20px', borderRadius: '5px' }}>Item 3</div>
        <div style={{ backgroundColor: base_color, padding: '20px', borderRadius: '5px' }}>Item 4</div>
        <div style={{ backgroundColor: base_color, padding: '20px', borderRadius: '5px' }}>Item 5</div>
        <div style={{ backgroundColor: base_color, padding: '20px', borderRadius: '5px' }}>Item 6</div>
*/}


      </div>
    </div>
  );
}

export default App;