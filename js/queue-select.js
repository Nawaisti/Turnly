/**
 * queue-select.js
 * Turnly V2 — Week 3 / Step 06 — JavaScript Task 01: Select & Change
 *
 * PURPOSE:
 *   Demonstrate DOM selection and visible UI modification.
 *   On page load, reads the currently selected restaurant from the
 *   <select id="restaurant"> dropdown and updates the scene card label
 *   in the aside column to display the selected restaurant name.
 *
 * SELECTORS USED:
 *   - document.getElementById('restaurant')   → targets the restaurant <select>
 *   - document.getElementById('scene-label')  → targets the scene card title span
 *
 * PROPERTY MODIFIED:
 *   - element.textContent                     → updates the visible text content
 *
 * SCOPE: Select & Change only. No event listeners, no storage, no form logic.
 */

// Step 1: Select the restaurant <select> element by its unique id
const restaurantSelect = document.getElementById('restaurant');

// Step 2: Select the scene card label element in the aside column
const sceneLabel = document.getElementById('scene-label');

// Step 3: Build a readable name map from option values to display labels
const restaurantNames = {
  'pixel-resto': 'PIXEL RESTO',
  'sunny-bites': 'SUNNY BITES',
  'ramen-ya':    'RAMEN YA!',
};

// Step 4: Read the currently selected value and resolve the display name
const selectedValue = restaurantSelect.value;
const displayName   = restaurantNames[selectedValue] || selectedValue.toUpperCase();

// Step 5: Modify the scene label text to reflect the selected restaurant
sceneLabel.textContent = String.fromCodePoint(0x1F3F4) + ' ' + displayName;

// -- Step 07: Event Handling -------------------------------------------------

/**
 * handleRestaurantChange
 * Fired when the user selects a different restaurant from the dropdown.
 * Reads the new value and updates #scene-label via textContent.
 *
 * EVENT: 'change' on <select id="restaurant">
 */
function handleRestaurantChange(event) {
  const newValue       = event.target.value;
  const newDisplayName = restaurantNames[newValue] || newValue.toUpperCase();
  sceneLabel.textContent = String.fromCodePoint(0x1F3F4) + ' ' + newDisplayName;
}

// Attach the event listener -- reuses restaurantSelect from Step 06
restaurantSelect.addEventListener('change', handleRestaurantChange);

// -- Step 08: Form Handling --------------------------------------------------

/**
 * handleQueueFormSubmit
 * Fired when the user submits the Join Queue form.
 *
 * 1. Prevents the default HTML form submission (no page reload / navigation).
 * 2. Reads the three form field values using getElementById.
 * 3. Populates the confirmation panel with the collected values.
 * 4. Reveals the confirmation panel by removing the `hidden` attribute.
 *
 * EVENT: 'submit' on <form id="queue-form">
 * READS:
 *   - #customer-name  → input[type="text"]
 *   - #restaurant     → select (already declared in Step 06)
 *   - #party-size     → select
 * WRITES:
 *   - #confirm-name        → textContent
 *   - #confirm-restaurant  → textContent
 *   - #confirm-party       → textContent
 *   - #queue-confirmation  → removes [hidden]
 */
function handleQueueFormSubmit(event) {
  // Step 08-A: Prevent default form navigation to status.html
  event.preventDefault();

  // Step 08-B: Read the three input values
  const nameInput      = document.getElementById('customer-name');
  const partySizeInput = document.getElementById('party-size');

  const nameValue      = nameInput.value.trim();
  const restaurantValue = restaurantSelect.value;           // reused from Step 06
  const partySizeValue  = partySizeInput.value;

  // Step 08-C: Resolve the readable restaurant display name (reuse map from Step 06)
  const restaurantDisplay = restaurantNames[restaurantValue] || restaurantValue.toUpperCase();

  // Step 08-D: Resolve readable party size label
  const partySizeLabels = {
    '1': '1 Person', '2': '2 People', '3': '3 People',
    '4': '4 People', '5': '5 People', '6+': '6+ People',
  };
  const partySizeDisplay = partySizeLabels[partySizeValue] || partySizeValue;

  // Step 08-E: Populate confirmation panel paragraphs
  document.getElementById('confirm-name').textContent       = String.fromCodePoint(0x1F464) + '  Name: '       + nameValue;
  document.getElementById('confirm-restaurant').textContent = String.fromCodePoint(0x1F3F4) + '  Restaurant: ' + restaurantDisplay;
  document.getElementById('confirm-party').textContent      = String.fromCodePoint(0x1F465) + '  Party size: ' + partySizeDisplay;

  // Step 08-F: Reveal the confirmation panel
  document.getElementById('queue-confirmation').removeAttribute('hidden');
}

// Attach the submit event listener to the form
const queueForm = document.getElementById('queue-form');
queueForm.addEventListener('submit', handleQueueFormSubmit);

// -- Step 09: Form Validation ------------------------------------------------

/**
 * VALID_RESTAURANTS
 * Set of accepted restaurant option values for whitelist validation.
 * Mirrors the <option> values in #restaurant exactly.
 */
const VALID_RESTAURANTS = new Set(['pixel-resto', 'sunny-bites', 'ramen-ya']);

/**
 * VALID_PARTY_SIZES
 * Set of accepted party-size option values for whitelist validation.
 * Mirrors the <option> values in #party-size exactly.
 */
const VALID_PARTY_SIZES = new Set(['1', '2', '3', '4', '5', '6+']);

/**
 * showError(id, message)
 * Reveals a validation error paragraph by id and writes the message.
 * Sets an inline error colour without touching the stylesheet.
 *
 * @param {string} id      - The element id of the error <p> (e.g. 'error-name')
 * @param {string} message - Human-readable validation message
 */
function showError(id, message) {
  const el = document.getElementById(id);
  el.textContent    = message;
  el.style.color    = '#b91c1c';   // clear red — visible against cream bg
  el.style.fontSize = '0.8125rem'; // matches --font-size-sm token value
  el.style.fontWeight = '600';
  el.removeAttribute('hidden');
}

/**
 * hideError(id)
 * Hides a validation error paragraph and clears its message.
 *
 * @param {string} id - The element id of the error <p>
 */
function hideError(id) {
  const el = document.getElementById(id);
  el.textContent = '';
  el.setAttribute('hidden', '');
}

/**
 * validateQueueForm(nameValue, restaurantValue, partySizeValue)
 * Validates all three queue form fields against their rules.
 * Shows/hides the appropriate error paragraphs.
 *
 * RULES:
 *   - Name:        must not be empty after trim()
 *   - Restaurant:  must be a value in VALID_RESTAURANTS
 *   - Party size:  must be a value in VALID_PARTY_SIZES
 *
 * @param {string} nameValue        - Trimmed customer name
 * @param {string} restaurantValue  - Selected restaurant value
 * @param {string} partySizeValue   - Selected party size value
 * @returns {boolean} true if all fields are valid, false otherwise
 */
function validateQueueForm(nameValue, restaurantValue, partySizeValue) {
  let isValid = true;

  // Rule 1: Customer name must not be empty
  if (nameValue === '') {
    showError('error-name', 'Please enter your name.');
    isValid = false;
  } else {
    hideError('error-name');
  }

  // Rule 2: Restaurant must be a known, valid option
  if (!VALID_RESTAURANTS.has(restaurantValue)) {
    showError('error-restaurant', 'Please select a restaurant.');
    isValid = false;
  } else {
    hideError('error-restaurant');
  }

  // Rule 3: Party size must be a known, valid option
  if (!VALID_PARTY_SIZES.has(partySizeValue)) {
    showError('error-party', 'Please select a party size.');
    isValid = false;
  } else {
    hideError('error-party');
  }

  return isValid;
}

// -- Step 09: Patch handleQueueFormSubmit to run validation first -------------
// We replace the existing submit listener with a patched version that runs
// validateQueueForm() before proceeding to the Step 08 confirmation display.
// The original queueForm reference and all Step 06/07 code remain untouched.

queueForm.removeEventListener('submit', handleQueueFormSubmit);

function handleQueueFormSubmitWithValidation(event) {
  event.preventDefault();

  // Step 09-A: Read field values (same as Step 08)
  const nameInput      = document.getElementById('customer-name');
  const partySizeInput = document.getElementById('party-size');

  const nameValue      = nameInput.value.trim();
  const restaurantValue = restaurantSelect.value;   // reused from Step 06
  const partySizeValue  = partySizeInput.value;

  // Step 09-B: Run validation -- stop here if any field is invalid
  const isValid = validateQueueForm(nameValue, restaurantValue, partySizeValue);
  if (!isValid) {
    // Hide confirmation panel if it was previously shown
    document.getElementById('queue-confirmation').setAttribute('hidden', '');
    return;
  }

  // Step 09-C: All fields valid -- run Step 08 confirmation logic
  const restaurantDisplay = restaurantNames[restaurantValue] || restaurantValue.toUpperCase();

  const partySizeLabels = {
    '1': '1 Person', '2': '2 People', '3': '3 People',
    '4': '4 People', '5': '5 People', '6+': '6+ People',
  };
  const partySizeDisplay = partySizeLabels[partySizeValue] || partySizeValue;

  document.getElementById('confirm-name').textContent       = String.fromCodePoint(0x1F464) + '  Name: '       + nameValue;
  document.getElementById('confirm-restaurant').textContent = String.fromCodePoint(0x1F3F4) + '  Restaurant: ' + restaurantDisplay;
  document.getElementById('confirm-party').textContent      = String.fromCodePoint(0x1F465) + '  Party size: ' + partySizeDisplay;

  document.getElementById('queue-confirmation').removeAttribute('hidden');
}

queueForm.addEventListener('submit', handleQueueFormSubmitWithValidation);

// -- Step 10: Dynamic Queue Preview ------------------------------------------

/**
 * updateQueuePreview(nameValue, restaurantDisplay, partySizeDisplay)
 * Populates the three <dd> slots in #queue-preview with the valid form values
 * and reveals the preview card by removing its [hidden] attribute.
 *
 * Called ONLY from the valid-submit path in handleQueueFormSubmitWithValidation.
 * All three values are already resolved (trimmed, display-name-mapped) before
 * this function is called -- no duplicate reading or mapping is performed.
 *
 * WRITES (via textContent):
 *   - #preview-name        ← customer name
 *   - #preview-restaurant  ← restaurant display name
 *   - #preview-party       ← party size display label
 *   - #queue-preview       ← removes [hidden]
 *
 * @param {string} nameValue        - Trimmed, validated customer name
 * @param {string} restaurantDisplay - Human-readable restaurant name from map
 * @param {string} partySizeDisplay  - Human-readable party size label from map
 */
function updateQueuePreview(nameValue, restaurantDisplay, partySizeDisplay) {
  document.getElementById('preview-name').textContent       = nameValue;
  document.getElementById('preview-restaurant').textContent = restaurantDisplay;
  document.getElementById('preview-party').textContent      = partySizeDisplay;
  document.getElementById('queue-preview').removeAttribute('hidden');
}

// -- Step 10: Patch handleQueueFormSubmitWithValidation to call the preview ---
// Remove the Step 09 listener and re-attach an extended version that also
// calls updateQueuePreview on the valid-submit path.
// Steps 06, 07, 08, and 09 code remain entirely untouched.

queueForm.removeEventListener('submit', handleQueueFormSubmitWithValidation);

function handleQueueFormSubmitWithPreview(event) {
  event.preventDefault();

  // Read field values (same as Steps 08 and 09)
  const nameInput      = document.getElementById('customer-name');
  const partySizeInput = document.getElementById('party-size');

  const nameValue      = nameInput.value.trim();
  const restaurantValue = restaurantSelect.value;   // reused from Step 06
  const partySizeValue  = partySizeInput.value;

  // Run validation (Step 09) -- abort early if any field fails
  const isValid = validateQueueForm(nameValue, restaurantValue, partySizeValue);
  if (!isValid) {
    document.getElementById('queue-confirmation').setAttribute('hidden', '');
    document.getElementById('queue-preview').setAttribute('hidden', '');
    return;
  }

  // Resolve display names (same maps as Steps 08 and 09)
  const restaurantDisplay = restaurantNames[restaurantValue] || restaurantValue.toUpperCase();

  const partySizeLabels = {
    '1': '1 Person', '2': '2 People', '3': '3 People',
    '4': '4 People', '5': '5 People', '6+': '6+ People',
  };
  const partySizeDisplay = partySizeLabels[partySizeValue] || partySizeValue;

  // Step 08 confirmation panel (unchanged behavior)
  document.getElementById('confirm-name').textContent       = String.fromCodePoint(0x1F464) + '  Name: '       + nameValue;
  document.getElementById('confirm-restaurant').textContent = String.fromCodePoint(0x1F3F4) + '  Restaurant: ' + restaurantDisplay;
  document.getElementById('confirm-party').textContent      = String.fromCodePoint(0x1F465) + '  Party size: ' + partySizeDisplay;
  document.getElementById('queue-confirmation').removeAttribute('hidden');

  // Step 10 queue preview (new)
  updateQueuePreview(nameValue, restaurantDisplay, partySizeDisplay);
}

queueForm.addEventListener('submit', handleQueueFormSubmitWithPreview);
