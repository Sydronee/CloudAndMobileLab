import { useState } from 'react';
import { Contacts } from '@capacitor-community/contacts';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const wgetContactInfo = async () => {
    try {
      setLoading(true);
      setStatus('Requesting permissions...');

      // 1. Request Permissions
      const permission = await Contacts.requestPermissions();
      if (permission.contacts !== 'granted' && permission.contacts !== 'limited') {
        setStatus('Permission denied for contacts.');
        setLoading(false);
        return;
      }

      setStatus('Reading contacts...');
      
      // 2. Get Contacts
      const result = await Contacts.getContacts({
        projection: {
          name: true,
          phones: true,
          emails: true,
          note: true,
        }
      });

      setContacts(result.contacts);
      setStatus(`Fetched ${result.contacts.length} contacts.`);

    } catch (error) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const exportInformation = async () => {
    if (contacts.length === 0) {
      setStatus('No contacts to export. Please "Get Contact Info" first.');
      return;
    }

    try {
      setLoading(true);
      setStatus('Formatting data...');

      // 3. Format Data
      let fileContent = 'CONTACT BACKUP\n';
      fileContent += `Date: ${new Date().toLocaleString()}\n`;
      fileContent += '====================================\n\n';

      contacts.forEach(contact => {
        const name = contact.name?.display || contact.displayName || 'Unnamed';
        const phones = contact.phones?.map(p => p.number).join(', ') || 'N/A';
        const emails = contact.emails?.map(e => e.address).join(', ') || 'N/A';
        const note = contact.note || 'N/A';
        
        fileContent += `Name: ${name}\n`;
        fileContent += `Phone: ${phones}\n`;
        fileContent += `Email: ${emails}\n`;
        fileContent += `Notes: ${note}\n`; 
        fileContent += '------------------------------------\n';
      });

      setStatus('Saving to Documents folder...');

      // 4. Write to File
      const fileName = `contacts_backup_${Date.now()}.txt`;
      
      await Filesystem.writeFile({
        path: fileName,
        data: fileContent,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      setStatus(`Success! Saved to Documents/${fileName}`);

    } catch (error) {
      console.error(error);
      setStatus(`Error exporting: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <h1>Contact Backup Tool</h1>
      
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
        
        <button onClick={getContactInfo} disabled={loading} style={{ padding: '12px', fontSize: '1rem', cursor: 'pointer' }}>
          Get Contact Info
        </button>
        
        <button onClick={exportInformation} disabled={loading || contacts.length === 0} style={{ padding: '12px', fontSize: '1rem', cursor: 'pointer' }}>
          Export Information
        </button>

        {status && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#333', color: '#fff', borderRadius: '5px' }}>
            <p className="status-text" style={{margin: 0}}>{status}</p>
          </div>
        )}
      </div>

      {contacts.length > 0 && (
        <div style={{ marginTop: '30px', width: '100%', maxWidth: '500px' }}>
          <h3 style={{ textAlign: 'center' }}>Top 10 Contacts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {contacts.slice(0, 10).map((contact, index) => (
              <div key={index} style={{ 
                border: '1px solid #444', 
                borderRadius: '8px', 
                padding: '15px', 
                backgroundColor: '#1a1a1a', 
                textAlign: 'left'
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginBottom: '5px' }}>
                  {contact.name?.display || contact.displayName || 'Unnamed'}
                </div>
                <div style={{ fontSize: '0.9em', color: '#ccc' }}>
                   Phone: {contact.phones?.[0]?.number || 'N/A'}<br/>
                   Email: {contact.emails?.[0]?.address || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
