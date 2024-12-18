let exists = null
let client = null
let link = null
let regex = null
let m = null
let insertEl = null


let getAsin = async () => {
	 exists = null
	 client = null
	 link = window.location.href;
	 regex = RegExp("/([a-zA-Z0-9]{10})(?:[/?]|$)");
	 m = link.match(regex);
	// console.log({match: m[1]})
	insertEl = document.querySelector("#ppd")
	return
}

getAsin()

chrome.storage.onChanged.addListener((changes, area) => {
	
 	console.log({changes, area})
 	loadClientId()
});

window.navigation.addEventListener("navigate", async (event) => {

    console.log('location changed!');
    await getAsin();

    loadClientId()
})
// chrome.storage.sync.clear()




const loadClientId = async () => {
	console.log("load client TOKEN")
	try {
		const data = await chrome.storage.sync.get(null);
		console.log({data})
		// if("clientId" in data && isFinite(data.clientId)) {
		// 	loadIframe(data)
		// }
		if("token" in data) {
			loadIframe(data)
		}
		else {
			document.querySelector("#domo-iframe").remove()
		}
	}
	catch( err ) {
		console.log("ERR: "+err)
	}

	return;
}

loadClientId()

let loadIframe = async(data) => {

	console.log({loadIframe: data})
	// return
	// let url = `http://localhost:3000/hello`;


	// let url = "https://jg7u2upo2udattxsajfylgh6ma0uobry.lambda-url.us-east-1.on.aws/hello"
	let url = `https://jg7u2upo2udattxsajfylgh6ma0uobry.lambda-url.us-east-1.on.aws/domo_embed_v2`

	let resp = await fetch(url, {
		method: "POST",
		headers: (() => {
            let header = new Headers();
            header.append("Content-Type", `application/json`);
            header.append("Accept", `*/*`);
            return header
        })(),
		body: JSON.stringify({asin: m[1], token: data.token})
	})

	resp = await resp.text()

	console.log({resp})


	try {
		console.log("removing document element")
		document.querySelector('#domo-iframe').remove()
	} catch (err) {
		console.log("ERR "+err)
	}

	let insertEl = document.querySelector("#ppd")
	let newEl = document.createElement('iframe')
	newEl.id = 'domo-iframe';
	newEl.style.width = 'clamp(390px, 1000px, 99vw)';
	newEl.style.minHeight = '600px';
	newEl.style.border = "none";

	if(resp == 'not found') {
		
		// newEl.srcdoc = `<h4>Client does not have this product '${m[1]}'</h4>`
		newEl.style.minHeight = '300px';
		newEl.srcdoc =[
			`<div>`,
				`<img src="https://uploads-ssl.webflow.com/643612f85ab90f7412a165c7/660502efd5339cffb2efe9d9_email-bispoke-desktop-01-header-logo.jpg" />`,
			`</div>`,
			`<p>‘ASIN not found within client data.  Please contact <b>support@biusers.com</b> if this is unexpected.’</p>`
		].join(" ")
		insertEl.after(newEl);	
		return
	}

	
	newEl.srcdoc = resp
	insertEl.after(newEl);	

}






// console.log(idInput)


