const dns = require('dns').promises;
const { readFile } = require('node:fs/promises');

let blocklist = [];
let blocklistLoaded = false;
let loadBlocklistPromise;

// Function to load the blocklist
async function loadBlocklist() {
  if (!blocklistLoaded) {
    try {
      const content = await readFile('disposable_email_blocklist.conf', { encoding: 'utf-8' });
      blocklist = content.split('\n').map(domain => domain.trim()).filter(Boolean);
      blocklistLoaded = true;
    } catch (err) {
      console.error('Error reading blocklist file:', err);
    }
  }
}

// Load blocklist via promise to ensure it's loaded before function is called
loadBlocklistPromise = loadBlocklist();

function isDisposable(email) {
  return blocklist.includes(email.split('@')[1]);
}

function correctFormat(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

async function hasMXRecords(domain) {
  try {
    const mxRecords = await dns.resolveMx(domain);
    return mxRecords && mxRecords.length > 0;
  } catch (err) {
    console.error(`MX lookup failed: ${err.message}`);
    return false;
  }
}

async function validateEmail(email) {
  await loadBlocklistPromise;

  const result = {
    valid: false,
    details: {
      correctFormat: false,
      disposableEmail: false,
      hasMXRecords: false,
    },
    message: '',
    code: '' // To store the validation code
  };

  const domain = email.split('@')[1];

  if (!correctFormat(email)) {
    result.details.correctFormat = false;
    result.message = 'Invalid email format';
    result.code = 'INVALID_FORMAT';
  } else {
    result.details.correctFormat = true;
  }

  if (result.details.correctFormat && isDisposable(email)) {
    result.details.disposableEmail = true;
    result.message = 'Disposable email address';
    result.code = 'DISPOSABLE_EMAIL';
  }

  if (result.details.correctFormat && !result.details.disposableEmail) {
    if (await hasMXRecords(domain)) {
      result.details.hasMXRecords = true;
    } else {
      result.details.hasMXRecords = false;
      result.message = 'Domain does not accept mail';
      result.code = 'DOMAIN_NO_MX';
    }
  }

  if (result.details.correctFormat && !result.details.disposableEmail && result.details.hasMXRecords) {
    result.valid = true;
    result.message = 'Email is valid';
    result.code = 'VALID_EMAIL';
  }

  return result;
}

module.exports = validateEmail;
