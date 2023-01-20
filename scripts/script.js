// Clicking on the respective tab shows the correct app.
function encryptAppSwitch() {
    document.getElementById('encrypt-app').classList.remove('hide');
    document.getElementById('decrypt-app').classList.add('hide');
    document.getElementById('brute-app').classList.add('hide');

    document.getElementById('encrypt-tab').classList.add('current');
    document.getElementById('decrypt-tab').classList.remove('current');;
    document.getElementById('brute-tab').classList.remove('current');
}
function decryptAppSwitch() {
    document.getElementById('encrypt-app').classList.add('hide');
    document.getElementById('decrypt-app').classList.remove('hide');
    document.getElementById('brute-app').classList.add('hide');

    document.getElementById('encrypt-tab').classList.remove('current');
    document.getElementById('decrypt-tab').classList.add('current');;
    document.getElementById('brute-tab').classList.remove('current');
}
function bruteAppSwitch() {
    document.getElementById('encrypt-app').classList.add('hide');
    document.getElementById('decrypt-app').classList.add('hide');
    document.getElementById('brute-app').classList.remove('hide');

    document.getElementById('encrypt-tab').classList.remove('current');
    document.getElementById('decrypt-tab').classList.remove('current');;
    document.getElementById('brute-tab').classList.add('current');
}

// Encryption app process.
function encryptApp() {
    // Establishes message, result, and shift variables based on user inputs.
    let msg = document.getElementById('encrypt-msg').value.toUpperCase();
    let shift = document.getElementById('encrypt-key').value;
    let result = '';

    // Checks if key/shift is negative and if so converts to reciprocal (ie. '-1' becomes '25').
    if (shift < 0) {
        shift = 26 - Math.abs(shift % 26);
    }

    // Checks if key/shift is above 26 and if so cycles back (ie. '27' becomes '1').
    if (shift > 26) {
        shift = shift % 26;
    }

    // Main loop for converting characters from string into num values, shifting them, and then converting back.
    for (const l of msg) {
        // Tests for non-alphabet characters and passes them through/skips them (ie. spaces, numbers, special chars).
        if (!/[A-Z]/.test(l)) {
            result += l;
        }
        else {
            // Converts each character from string into a num value. Consult ASCII chart for decimal value reference.
            let crypt = l.charCodeAt(0);
            // Shifts this num value based on shift value.
            crypt -= shift;
            // Checks if new value is below char code for 'A' (65) and if so cycles back to 'Z' (90) by adding 26.
            if (crypt < 65) {
                crypt += 26;
            }
            // Converts new num values back into chars and compiles into encrypted string.
            result += String.fromCharCode(crypt);
        }
    }
    // Writes output to document.
    document.getElementById('encrypt-rot').innerHTML = 'ROT' + shift + ' ⮕';
    document.getElementById('encrypt-result').innerHTML = result;

    // Enables scrolling for output if message length is too large.
    if (msg.length > 250) {
        document.getElementById('encrypt-app').style.overflowY = 'scroll';
    }

    // Exit.
    return result;
}

// Decryption app process. Exactly the same as encryption process except input shift is multiplied by -1 to reverse.
function decryptApp() {
    let msg = document.getElementById('decrypt-msg').value.toUpperCase();
    // Multiplies the shift/key by '-1', effectively reversing the rotation.
    let shift = document.getElementById('decrypt-key').value * -1;
    let result = '';

    if (shift < 0) {
        shift = 26 - Math.abs(shift % 26);
    }

    if (shift > 26) {
        shift = shift % 26;
    }

    for (const l of msg) {
        if (!/[A-Z]/.test(l)) {
            result += l;
        }
        else {
            let crypt = l.charCodeAt(0);
            crypt -= shift;
            if (crypt < 65) {
                crypt += 26;
            }
            result += String.fromCharCode(crypt);
        }
    }

    document.getElementById('decrypt-rot').innerHTML = 'ROT' + shift + ' ⮕';
    document.getElementById('decrypt-result').innerHTML = result;

    if (msg.length > 250) {
        document.getElementById('decrypt-app').style.overflowY = 'scroll';
    }

    return result;
}

// Bruteforce char shift process. Exactly the same as encryption process except shift is taken as a (parameter) for iteration in later function.
function bruteAppProcess(shift) {
    let msg = document.getElementById('brute-msg').value.toUpperCase();
    let result = '';

    if (shift < 0) {
        shift = 26 - Math.abs(shift % 26);
    }

    if (shift > 26) {
        shift = shift % 26;
    }

    for (const l of msg) {
        if (!/[A-Z]/.test(l)) {
            result += l;
        }
        else {
            let crypt = l.charCodeAt(0);
            crypt -= shift;
            if (crypt < 65) {
                crypt += 26;
            }
            result += String.fromCharCode(crypt);
        }
    }

    return result;
}

// Bruteforce app process. Iterates through and displays all 25 permutations and highlights most likely phrase.
function bruteApp() {
    let maxCount = 0;
    let likePhrase = "";
    // Looping through all 25 permutations.
    for (let i = 1; i < 26; i++) {
        let opts = bruteAppProcess(i);
        let node = document.getElementById('brute-node-' + i);

        // Removes highlight from previous output.
        node.classList.remove('highlight');

        // Displays the respective permutation.
        node.innerHTML = '<span>' + 'ROT' + i + ' ⮕ ' + '</span>' + opts;

        // Loading and formatting array of commonly used words.
        let commonWords = en.map(word => {
            return word.toUpperCase();
        });

        // Converting output string to array.
        optsArray = opts.split(" ");

        // Looping through array of words from phrase and checking for common words.
        let count = 0;
        for (let i = 0; i < optsArray.length; i++) {
            for (let w = 0; w < commonWords.length; w++) {
                if (optsArray[i] === commonWords[w]) {
                    count++;
                }
            }
        }
        
        // Comparing frequency of common words in current premutation to best fit.
        if (count !== 0 && count >= maxCount) {
            likePhrase = node;
            maxCount = count;
        }
        console.log(count, maxCount, likePhrase)
    }
    
    // Enables scrolling within app container for viewing all permutations.
    document.getElementById('brute-app').style.overflowY = 'scroll';

    // Adding highlight styling to most likely phrase and scrolling to its position.
    if (likePhrase !== "") {
        likePhrase.classList.add('highlight');
        likePhrase.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
    }
}