let shiftIsPressed = false;
let autoCompletions = null;

autoCompletions = null

let handleDialogIterationsLeft = 0;

function main() {
    console.log("[SPA] Loaded.");

    document.addEventListener("keydown", (event) => {
        // if (event.key === "Shift" && !shiftIsPressed) {
        //     shiftIsPressed = true;
        //     console.log("[SPA] Shift key pressed.")
        // }
        if (event.key === "Enter") {
            trySaveAutoCompletion();
        }
    });

    // document.addEventListener("keyup", (event) => {
    //     if (event.key === "Shift" && shiftIsPressed) {
    //         shiftIsPressed = false;
    //         console.log("[SPA] Shift key released.")
    //     }
    // });

    document.addEventListener("focusin", (event) => {
        // initialise things when focus moves to the event title field
        if (event.target.getAttribute("aria-label") === "Add title") {
            console.debug("focusin on add title field")
            if (autoCompletions === null) {
                loadAutoCompletions()
                console.log("autoCompletions:", autoCompletions);
            }
        }
    });

    document.addEventListener("click", (event) => {
        console.debug("clicked on:", event.target)
        if (event.target.parentElement !== null &&
                event.target.parentElement.getAttribute("jsname") === "x8hlje") {
            trySaveAutoCompletion();
        }
    });

    document.addEventListener("beforeinput", event => {
        // Autocomplete event title & calendar
        if (event.target.getAttribute("aria-label") === "Add title" &&
                event.inputType === "insertText") {

            console.debug("Autocompleting event title.");
            let titleField = document.activeElement;
            let titleBefore = titleField.value;
            let caretPos = titleField.selectionEnd;

            if (caretPos === titleBefore.length) { // Only autocomplete if caret is at the end
                // console.log("event.data: " + event.data)
                let titleAfter = titleBefore.substring(0, titleField.selectionStart) + event.data;
                let autoCompleteCandidates = autoCompletions.events.filter(
                    (event) => event.title.startsWith(titleAfter));
                console.log("autoCompleteCandidates:", autoCompleteCandidates);

                if (autoCompleteCandidates.length >= 1) {
                    let chosenAutoCompletion = autoCompleteCandidates[0]

                    // auto-complete title
                    titleField.value = chosenAutoCompletion.title;
                    // console.log("new titleField.value: " + titleField.value);
                    // console.log("titleAfter: " + titleAfter);
                    titleField.setSelectionRange(titleAfter.length, -1);
                    event.preventDefault()  //prevent typed character replacing the autocompleted text

                    // auto-complete calendar
                    let calendarListCandidates = document.getElementsByClassName(
                        "VfPpkd-rymPhb r6B9Fd bwNLcf P2Hi5d VfPpkd-OJnkse")
                    // console.log(calendarListCandidates);

                    for (const calendarList of calendarListCandidates) {
                        if (calendarList.getAttribute("aria-label") !== "List of calendars") continue;
                        // console.log("[SPA] Found calendar list.");

                        for (const elem of calendarList.children) {
                            // console.log(elem)
                            if (elem.tagName !== "LI") continue;
                            let calendarName = elem.children[2].children[0].innerHTML;
                            // console.log("innerHTML: " + calendarName);
                            // console.log("Looking for: " + chosenAutoCompletion.calendar);
                            if (calendarName === chosenAutoCompletion.calendar) {
                                elem.click();
                                // console.log("[SPA] Clicked calendar " + chosenAutoCompletion.calendar);
                                break;
                            }
                        }
                    }
                }
            }
        }
    })

    document.addEventListener("drop", (event) => {
        console.debug("drop event triggered");
        console.debug("event.shiftKey: " + event.shiftKey)
        shiftIsPressed = event.shiftKey
        handleDialog(10)
    });
}

function trySaveAutoCompletion() {
    console.debug("trySaveAutoCompletion");
    let titleField = document.querySelector('.Fgl6fe-fmcmS-wGMbrd[aria-label="Add title"]');
    let calendarField = document.querySelector('.VfPpkd-TkwUic[jsname="oYxtQd"] .VfPpkd-uusGie-fmcmS-haAclf .VfPpkd-uusGie-fmcmS[jsname="Fb0Bif"][aria-label=""]');
    console.debug("titleField:", titleField);
    console.debug("calendarField:", calendarField);

    // in this case we're not saving an event so no need to do anything
    if (titleField === null || calendarField === null) return;

    let titleText = titleField.value;
    let calendarText = calendarField.innerHTML;
    console.log("Saving auto-completion: " + titleText + " in " + calendarText);

    // This first line doesn't actually work, I think because !== isn't comparing the JSON objects properly
    // To fix this, maybe use a library such as Lodash which actually has a good collections API
    autoCompletions.events = autoCompletions.events.filter(x => x !== {title: titleText, calendar: calendarText})
    autoCompletions.events.unshift({title: titleText, calendar: calendarText});
    localStorage.setItem("autoCompletions", JSON.stringify(autoCompletions));
}

function loadAutoCompletions() {
    autoCompletions = JSON.parse(localStorage.getItem("autoCompletions"));
    if (autoCompletions === null) {
        autoCompletions = {events: []};
    }
}

function delay(time, func) {
    new Promise(resolve => setTimeout(resolve, time)).then(func);
}

function handleDialog(iterations=null) {
    // outermost call -> set this variable to keep track of iterations
    if (iterations !== null) {
        handleDialogIterationsLeft = iterations;
    }

    // finished desired number of iterations
    if (handleDialogIterationsLeft === 0) {
        return;
    }
    else {
        handleDialogIterationsLeft--;
    }

    // Do not auto handle dialog when editing event, as this feature is not intuitive in this case
    if (window.location.href.includes("eventedit")) {
        delay(100, handleDialog);
        return;
    }

    if (shiftIsPressed) {
    	pressFollowingEventsBtn();
    	delay(100, pressOkBtn);
    	delay(200, handleDialog);
    }
    else {
        pressOkBtn();
        delay(100, handleDialog);
    }
}

function pressFollowingEventsBtn() {
	let possibleThisAndFollowingBtn = document.getElementsByClassName("GhEnC-gBXA9-bMcfAe");
	// console.debug("Found %d candidates for 'this and following events' button", possibleThisAndFollowingBtn.length)
    if (possibleThisAndFollowingBtn.length === 2 || possibleThisAndFollowingBtn.length === 3) {
		possibleThisAndFollowingBtn[1].checked = true;
		console.debug("Found and clicked \"this and following events\" button.");
	}
}

function pressOkBtn() {
    let possibleOkBtn = document.getElementsByClassName("UywwFc-LgbsSe UywwFc-LgbsSe-OWXEXe-dgl2Hf");
    // console.debug("Found %d candidates for 'ok' button", possibleOkBtn.length)
    if (possibleOkBtn.length === 1) {
        possibleOkBtn[0].click();
        console.debug("Found and clicked OK button.");
    }
}

main();