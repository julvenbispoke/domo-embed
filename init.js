function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
const Popup = () => {
  const {
    useEffect,
    useState
  } = React;
  const [clientId, setClientId] = useState("");
  const [exists, setExists] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const submitHandler = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* () {
      setError(false);
      if (["", null, undefined, isNaN, !isFinite].includes(clientId)) {
        setError(true);
        return;
      }
      setLoading(true);
      let resp = yield fetch(`https://jg7u2upo2udattxsajfylgh6ma0uobry.lambda-url.us-east-1.on.aws/domo_search_client_id`, {
        method: "POST",
        headers: (() => {
          const header = new Headers();
          header.append("Content-Type", "application/json");
          return header;
        })(),
        body: JSON.stringify({
          id: clientId
        })
      });
      setLoading(false);
      try {
        resp = yield resp.json();
        console.log({
          resp
        });
        if (resp.length > 0) {
          yield chrome.runtime.sendMessage({
            clientId
          }, function (response) {
            console.log({
              response
            });
            setExists(true);
          });
        } else {
          setError(true);
          setExists(false);
        }
      } catch (err) {
        console.log("ERR: " + err);
      }
    });
    return function submitHandler() {
      return _ref.apply(this, arguments);
    };
  }();
  const clearIdHandler = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* () {
      try {
        yield chrome.storage.sync.clear();
        setClientId("");
        setExists(null);
        console.log("clear client ID");
      } catch (err) {
        console.log("ERR: " + err);
      }
    });
    return function clearIdHandler() {
      return _ref2.apply(this, arguments);
    };
  }();
  const getClientId = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(function* () {
      try {
        const data = yield chrome.storage.sync.get(null);
        if ("clientId" in data && isFinite(data.clientId)) {
          setClientId(data.clientId);
        }
      } catch (err) {
        console.log("ERR: " + err);
      }
    });
    return function getClientId() {
      return _ref3.apply(this, arguments);
    };
  }();
  useEffect(() => {
    getClientId();
  }, []);
  useEffect(() => {
    console.log(clientId);
  }, [clientId]);
  useEffect(() => {
    console.log({
      exists
    });
  }, [exists]);
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid my-2",
    style: {
      minWidth: 250
    }
  }, /*#__PURE__*/React.createElement("h3", null, "Client ID"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-1 my-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    className: "form-control " + (error ? 'is-invalid' : ''),
    type: "number",
    value: clientId,
    onChange: e => setClientId(e.target.value)
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary " + (loading ? 'disabled' : ''),
    onClick: submitHandler
  }, "Submit"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-secondary " + (loading ? 'disabled' : ''),
    onClick: clearIdHandler
  }, "Clear")), /*#__PURE__*/React.createElement("p", {
    className: exists == true ? 'text-success' : exists == false ? 'text-danger' : ''
  }, exists == true ? 'Client ID exists' : exists == false ? 'Client ID DOES NOT exist' : ''));
};
try {
  const root = ReactDOM.createRoot(document.getElementById('app'));
  root.render( /*#__PURE__*/React.createElement(Popup, null));
} catch (err) {
  console.log("ERR: " + err);
}