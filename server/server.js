const express = require('express');
const cors = require('cors');
const qrcode = require('qrcode');
const db = require('./config/database');

const app = express();
const PORT = 5500;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(express.static('public'));

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Generate QR Code
app.post('/api/generate', async (req, res) => {
    try {
        const { phoneNumber, type } = req.body;
        
        if (!phoneNumber || !type) {
            return res.status(400).json({ 
                success: false, 
                error: 'Phone number and type are required' 
            });
        }

        let url;
        const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');

        switch(type) {
            case 'call':
                url = `tel:+${cleanPhoneNumber}`;
                break;
            case 'sms':
                url = `sms:+${cleanPhoneNumber}`;
                break;
            case 'whatsapp':
                url = `https://wa.me/${cleanPhoneNumber}`;
                break;
            case 'messenger':
                url = `https://m.me/${cleanPhoneNumber}`;
                break;
            default:
                throw new Error('Invalid communication type');
        }

        const qrImage = await qrcode.toDataURL(url);
        res.json({ success: true, qrCode: qrImage });
        
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Error generating QR code' 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 