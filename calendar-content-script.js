let shiftIsPressed = false;

function main() {
    console.log("[SPA] Loaded.");

    document.addEventListener("keydown", (event) => {
        if (event.key === "Shift" && !shiftIsPressed) {
            shiftIsPressed = true;
            console.log("[SPA] Shift key pressed.")
        }
    });
    document.addEventListener("keyup", (event) => {
        if (event.key === "Shift" && shiftIsPressed) {
            shiftIsPressed = false;
            console.log("[SPA] Shift key released.")
        }
    });

    delay(1000, handleDialog);
}

function delay(time, func) {
    new Promise(resolve => setTimeout(resolve, time)).then(func);
}

function handleDialog() {
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
	let possibleThisAndFollowingBtn = document.getElementsByClassName("VfPpkd-gBXA9-bMcfAe");
	if (possibleThisAndFollowingBtn.length === 2 || possibleThisAndFollowingBtn.length === 3) {
		possibleThisAndFollowingBtn[1].checked = true;
		console.log("[SPA] Found and clicked \"this and following events\" button.");
	}
}

function pressOkBtn() {
    let possibleOkBtn = document.getElementsByClassName("uArJ5e UQuaGc kCyAyd l3F1ye ARrCac HvOprf evJWRb M9Bg4d");
    if (possibleOkBtn.length === 1) {
        possibleOkBtn[0].click();
        console.log("[SPA] Found and clicked OK button.");
    }
}

main();