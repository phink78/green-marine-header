import { submitLead } from 'backend/lead-submit.jsw';

$w.onReady(function () {
  console.log('Calculator page loaded, setting up message listener...');

  // Listen for messages from the embedded calculator HTML
  $w('#html1').onMessage((event) => {
    console.log('Received message from html1:', event);

    // Handle different event structures
    let messageData = event.data || event;
    let type, data;

    if (messageData.type) {
      type = messageData.type;
      data = messageData.data;
    } else if (messageData.data && messageData.data.type) {
      type = messageData.data.type;
      data = messageData.data.data;
    }

    console.log('Parsed message - type:', type, 'data:', data);

    if (type === 'CALCULATOR_LEAD') {
      handleCalculatorLead(data);
    }
  });
});

async function handleCalculatorLead(leadData) {
  try {
    // Map frontend data to backend format
    const payload = {
      firstName: leadData.name?.split(' ')[0] || '',
      lastName: leadData.name?.split(' ').slice(1).join(' ') || '',
      email: leadData.email,
      phone: leadData.phone,

      customerType: leadData.customerType,
      boatType: leadData.boatType,
      currentDrive: leadData.currentDrive,

      boatLength: leadData.boatLength,
      boatWeight: leadData.boatWeight,

      waterType: leadData.waterType,
      tripBucket: mapTripDuration(leadData.tripDuration),
      tripDurationMin: getTripMin(leadData.tripDuration),
      tripDurationMax: getTripMax(leadData.tripDuration),

      result: {
        motorName: leadData.recommendedMotor,
        batteryKwh: leadData.recommendedBattery
      }
    };

    const result = await submitLead(payload);
    console.log('Lead submitted successfully:', result);

  } catch (error) {
    console.error('Failed to submit lead:', error);
  }
}

// Helper: map trip duration string to bucket
function mapTripDuration(duration) {
  if (!duration) return null;
  if (duration.includes('2') && duration.includes('4')) return '2to4';
  if (duration.includes('4') && duration.includes('8')) return '4to8';
  if (duration.includes('8') || duration.includes('+')) return '8plus';
  return null;
}

function getTripMin(duration) {
  if (!duration) return null;
  if (duration.includes('2')) return 2;
  if (duration.includes('4')) return 4;
  if (duration.includes('8')) return 8;
  return null;
}

function getTripMax(duration) {
  if (!duration) return null;
  if (duration.includes('4') && !duration.includes('8')) return 4;
  if (duration.includes('8') && !duration.includes('+')) return 8;
  return 12;
}
