console.clear()
let exists = null
let client = null
let link = window.location.href;
let regex = RegExp("/([a-zA-Z0-9]{10})(?:[/?]|$)");
let m = link.match(regex);
// console.log({match: m[1]})

let createInputEl = (exists) => {
	let idInput = [
	
		`<input type="number" id="embed-client-id"/>`,
		`<button type="submit" id="embed-submit">submit</button>`,
		((exists, client) => {
			if(exists==true) {
				return `<p>client ID EXISTS: ${client} </p>`
			}
			else return ""
		})(exists, client),
		((exists, client) => {
			if(exists==false) {
				return `<p>client ID  NOT FOUND: ${client} </p>`
			}
			else return ""
		})(exists, client),
		].join(" ");

	return idInput
}





let insertEl = document.querySelector("#ppd")

const submitForm = async (value) => {
	exists = null;
	if(!value) {
		console.log("no id value")
		return
	}

	console.log({value})

	let resp = await fetch(`https://jg7u2upo2udattxsajfylgh6ma0uobry.lambda-url.us-east-1.on.aws/domo_search_client_id`, {
		method: "POST",
		headers: (() => {
			const header = new Headers();
			header.append("Content-Type", "application/json");
			return header;
		})(),
		body: JSON.stringify({id: value}),
		
	})

	resp = await resp.json()

	
	if(resp.length == 0) {
		console.log("no result")
		exists = false
		updateDoc()
		return
	}
	console.log({resp})
	exists = true;
	updateDoc()
	loadIframe(	)
}

let updateDoc = () => {
	console.log({exists, inputEl: createInputEl(exists)})
	try {
		console.log("removing document element")
		document.querySelector('#domo-form').remove()
	} catch (err) {
		console.log("ERR "+err)
	}
	let form = document.createElement('div')
	form.id = "domo-form"
	form.innerHTML = createInputEl(exists);
	insertEl.after(form)
	document.querySelector('#embed-submit').addEventListener('click', (e) => {
		// console.log(document.querySelector("#embed-client-id").value)
		let value = document.querySelector("#embed-client-id").value;
		client = value
		submitForm(value)
	})
}

let loadIframe = async() => {

	console.log("loading iframe")

	// let url = `http://localhost:3000/hello`;
	let url = "https://jg7u2upo2udattxsajfylgh6ma0uobry.lambda-url.us-east-1.on.aws/hello"
	let resp = await fetch(url, {
		method: "POST",
		headers: (() => {
            let header = new Headers();
            header.append("Content-Type", `application/json`);
            header.append("Accept", `*/*`);
            return header
        })(),
		body: JSON.stringify({asin: m[1]})
	})

	resp = await resp.text()

	console.log({resp})

	try {
		console.log("removing document element")
		document.querySelector('#domo-form').remove()
	} catch (err) {
		console.log("ERR "+err)
	}

	let insertEl = document.querySelector("#ppd")
	// console.log({insertEl})
	let newEl = document.createElement('iframe')
	newEl.srcdoc = resp
	newEl.style.minWidth = '100%';
	newEl.style.minHeight = '600px';
	newEl.style.border = "none";

	insertEl.after(newEl);	

}




updateDoc()



// console.log(idInput)


