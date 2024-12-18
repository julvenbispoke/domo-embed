function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
const Index = () => {
  const {
    useState,
    useEffect
  } = React;
  const [token, setToken] = useState('');
  const [authorized, setAuthorized] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [initLogin, setInitLogin] = useState(false);
  const tokenChangeHandler = value => {
    setToken(value);
  };
  const logout = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* () {
      console.log("logout");
      try {
        yield chrome.storage.sync.clear();
        setAuthorized(null);
        setToken("");
        console.log("clear token");
      } catch (err) {
        console.log("ERR: " + err);
      }
    });
    return function logout() {
      return _ref.apply(this, arguments);
    };
  }();
  const login = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* () {
      setError("");
      setLoading(true);
      setAuthorized(null);
      console.log({
        token
      });
      let auth = yield fetch(`https://jg7u2upo2udattxsajfylgh6ma0uobry.lambda-url.us-east-1.on.aws/login_client`, {
        method: "POST",
        headers: (() => {
          const header = new Headers();
          header.append("Content-Type", "application/json");
          return header;
        })(),
        body: JSON.stringify({
          token
        }),
        redirect: "follow"
      });
      auth = yield auth.text();
      console.log({
        auth
      });
      if (auth != 'authorized') {
        setError("Invalid token");
        setLoading(false);
        setAuthorized(false);
        return;
      }
      setAuthorized(true);
      setLoading(false);
    });
    return function login() {
      return _ref2.apply(this, arguments);
    };
  }();
  const authorization = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(function* () {
      try {
        yield chrome.storage.sync.set({
          token
        }).then(() => {
          console.log("token is set: " + token);
        });
      } catch (err) {
        console.log("ERR: " + err);
      }
    });
    return function authorization() {
      return _ref3.apply(this, arguments);
    };
  }();
  const initLoginHandler = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(function* () {
      try {
        const data = yield chrome.storage.sync.get(null);
        console.log({
          data
        });
        if ("token" in data) {
          setToken(data.token);
          setTimeout(() => {
            setInitLogin(true);
          }, 100);
        }
      } catch (err) {
        console.log("ERR: " + err);
      }
    });
    return function initLoginHandler() {
      return _ref4.apply(this, arguments);
    };
  }();
  useEffect(() => {
    if (authorized == true) {
      console.log(authorized);
      try {
        authorization();
      } catch (err) {
        console.log("ERR: " + err);
      }
    }
  }, [authorized]);
  useEffect(() => {
    if (initLogin) {
      console.log({
        initLoginToken: token
      });
      setInitLogin(false);
      login();
    }
  }, [initLogin]);
  useEffect(() => {
    initLoginHandler();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 500
    },
    className: "container-fluid my-2"
  }, authorized ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "h3 mb-1"
  }, "You are authorized"), /*#__PURE__*/React.createElement("div", {
    className: "d-grid text-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-success py-2 mb-2",
    role: "alert"
  }, "Login Success"), /*#__PURE__*/React.createElement("button", {
    onClick: logout,
    className: "btn btn-outline-secondary"
  }, "Logout"))) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "h3"
  }, "Enter Token"), error != "" ? /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger py-2",
    role: "alert"
  }, error) : null, /*#__PURE__*/React.createElement("div", {
    className: "d-grid gap-3 text-wrap\t"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-control",
    value: token,
    onChange: e => tokenChangeHandler(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    disabled: loading,
    onClick: login,
    className: "btn btn-success"
  }, "Login"))));
};
try {
  const root = ReactDOM.createRoot(document.getElementById('app'));
  root.render( /*#__PURE__*/React.createElement(Index, null));
} catch (err) {
  console.log("ERR: " + err);
}