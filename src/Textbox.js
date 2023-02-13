
const textbox = document.getElementById('textbox');

document.getElementById('readOnly').addEventListener('click', (e) => {
    textbox.readOnly = !textbox.readOnly;
})

textbox.addEventListener('input', e => {
    if (textbox.readOnly == false) {
        if (leftPanel.spreadsheet == state[0]) {
            insights[leftPanel.firstClickY] = encodeURI(textbox.value.replaceAll(/,/g, '~'));
        } else {
            leftPanel.text = encodeURI(textbox.value.replaceAll(/,/g, '~'))
            console.log(leftPanel.text);
        }
    }
})