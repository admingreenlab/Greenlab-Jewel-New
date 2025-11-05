// CardSkeleton.jsx
import React from 'react';
import { IonCol } from '@ionic/react';

const CardSkeleton = () => {
  return (
    <IonCol size-md='4' size-sm='6' size='6'>
      <div
        className='main-card-ctgy'
        style={{
          marginBottom: '30px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          overflow: 'hidden',
          animation: 'pulse 1.5s infinite',
        }}
      >
        <div style={{ height: '200px', backgroundColor: '#e0e0e0' }}></div>
        <div style={{ padding: '10px' }}>
          <div style={{ height: '20px', backgroundColor: '#ddd', marginBottom: '10px', borderRadius: '4px' }}></div>
          <div style={{ height: '15px', backgroundColor: '#ddd', width: '50%', borderRadius: '4px' }}></div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
    </IonCol>
  );
};

export default CardSkeleton;
