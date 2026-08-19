import emailjs from '@emailjs/browser';

/**
 * Validates contact form submission data.
 * 
 * @param {Object} data 
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateContactForm(data) {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Please provide your name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!data.subject || data.subject.trim().length < 3) {
    errors.subject = 'Please provide a subject line (at least 3 characters).';
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Message must contain at least 10 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Sends contact transmission message via EmailJS or graceful simulated delivery.
 * 
 * @param {Object} payload - { name, email, subject, message }
 * @returns {Promise<{ success: boolean, isSimulated?: boolean, message?: string, error?: string }>}
 */
export async function sendEmailMessage({ name, email, subject, message }) {
  const validation = validateContactForm({ name, email, subject, message });
  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0];
    throw new Error(firstError);
  }

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const isConfigured =
    serviceId &&
    templateId &&
    publicKey &&
    !serviceId.includes('your_') &&
    !templateId.includes('your_') &&
    !publicKey.includes('your_');

  const templateParams = {
    from_name: name.trim(),
    from_email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
    sent_at: new Date().toISOString()
  };

  // If live EmailJS credentials are not present, provide realistic simulated dispatch
  if (!isConfigured) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return {
      success: true,
      isSimulated: true,
      message: 'Transmission signal broadcasted successfully! (Simulated Mode: Configure .env keys for live inbox delivery).'
    };
  }

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    return {
      success: true,
      isSimulated: false,
      message: 'Your message has been securely transmitted. I will respond promptly!',
      response
    };
  } catch (error) {
    const errorMsg = error?.text || error?.message || 'Transmission failed. Please reach out directly via email.';
    throw new Error(errorMsg);
  }
}
