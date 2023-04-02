let shiftIsPressed = false;

function main() {
    console.log("[SPA] Loaded.");

    document.addEventListener("keydown", (event) => {
        shiftIsPressed = event.shiftKey;
    });
    document.addEventListener("keyup", (event) => {
        shiftIsPressed = event.shiftKey;
    });

    delay(1000, handleDialog);
}

function delay(time, func) {
    new Promise(resolve => setTimeout(resolve, time)).then(func);
}

function handleDialog() {
    if (shiftIsPressed) {
        let possibleThisAndFollowingBtn = document.getElementsByClassName("VfPpkd-gBXA9-bMcfAe");
        if (possibleThisAndFollowingBtn.length === 3) {
            possibleThisAndFollowingBtn[1].checked = true;
            console.log("[SPA] Found and clicked \"this and following events\" button.");
        }
        delay(200, pressOkBtn);
    }
    else {
        pressOkBtn();
    }
}

function pressOkBtn() {
    let possibleOkBtn = document.getElementsByClassName("uArJ5e UQuaGc kCyAyd l3F1ye ARrCac HvOprf evJWRb M9Bg4d");
    if (possibleOkBtn.length === 1) {
        possibleOkBtn[0].click();
        console.log("[SPA] Found and clicked OK button.");
    }
    delay(200, handleDialog);
}

main();