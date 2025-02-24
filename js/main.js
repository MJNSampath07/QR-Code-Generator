// Update the fetch URL to match the server port
const API_URL = 'http://127.0.0.1:5500';

document.addEventListener('DOMContentLoaded', () => {
    const phoneNumberInput = document.getElementById('phoneNumber');
    const communicationType = document.getElementById('communicationType');
    const generateBtn = document.getElementById('generateBtn');
    const qrCodeDiv = document.getElementById('qrCode');
    const downloadBtn = document.getElementById('downloadBtn');

    let qrCode = null;

    // Add loading state to button
    const setLoading = (isLoading) => {
        generateBtn.disabled = isLoading;
        generateBtn.textContent = isLoading ? 'Generating...' : 'Generate QR Code';
    };

    // Format phone number as user types
    phoneNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            value = '+' + value;
        }
        e.target.value = value;
    });

    generateBtn.addEventListener('click', async () => {
        const phoneNumber = phoneNumberInput.value.replace(/\D/g, '');
        const type = communicationType.value;

        if (!phoneNumber) {
            alert('Please enter a valid phone number');
            phoneNumberInput.focus();
            return;
        }

        setLoading(true);
        qrCodeDiv.innerHTML = ''; // Clear previous QR code
        downloadBtn.classList.add('hidden');

        try {
            // Generate the appropriate URL based on communication type
            let url;
            switch(type) {
                case 'call':
                    url = `tel:${phoneNumber}`;
                    break;
                case 'sms':
                    url = `sms:${phoneNumber}`;
                    break;
                case 'whatsapp':
                    url = `https://wa.me/${phoneNumber}`;
                    break;
                case 'messenger':
                    url = `https://m.me/${phoneNumber}`;
                    break;
            }

            // Generate new QR code
            qrCode = new QRCode(qrCodeDiv, {
                text: url,
                width: 256,
                height: 256,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });

            downloadBtn.classList.remove('hidden');
        } catch (error) {
            console.error('Error:', error);
            alert('Error generating QR code: ' + error.message);
            qrCodeDiv.innerHTML = `<p style="color: red;">Error generating QR code. Please try again.</p>`;
        } finally {
            setLoading(false);
        }
    });

    downloadBtn.addEventListener('click', () => {
        const canvas = qrCodeDiv.querySelector('canvas');
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.download = 'qrcode.png';
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });
}); 