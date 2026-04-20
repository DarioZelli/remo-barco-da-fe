// WhatsApp helper improvements

const normalizePhoneNumber = (number) => {
    // Check if the number is a valid Brazilian number
    const regex = /^(55)?(\(?[1-9]{2}\)?)?[9]{1}[0-9]{8}$/;
    if (!regex.test(number)) {
        return { valid: false, reason: 'Invalid phone number format. Please use a valid 11-digit mobile number.' };
    }
    // Normalize to international format
    return { valid: true, normalized: number.replace(/^55|\D+/g, '').replace(/^(\d{2})(\d{1})(\d{8})$/, '55$1$2$3') };
};

const sendWhatsAppMessage = async (payload, eventType) => {
    // Log the payload for debugging
    console.log('Sending WhatsApp message with payload:', payload);
    // Call Z-API to send the message
    const response = await fetch(Z_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const result = await response.json();
    // Log detailed delivery results
    console.log('Delivery result:', result);
    return result;
};

module.exports = { normalizePhoneNumber, sendWhatsAppMessage };