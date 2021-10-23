import { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import jwt from "jsonwebtoken";
import axios from "axios";
import { withRouter } from "next/router";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import { API } from "../../../config";

const ActivateAccount = ({ router }) => {
  // state
  const [state, setState] = useState({
    name: "",
    token: "",
    buttonText: "Activate account",
    success: "",
    error: "",
  });

  const { name, token, buttonText, success, error } = state;
  //

  useEffect(() => {
    let token = router.query.token;
    console.log("this is the token", token);
    if (token) {
      const { name } = jwt.decode(token);
      setState({
        ...state,
        name,
        token,
      });
    }
  }, [router]);

  const clickSubmit = async (e) => {
    e.preventDefault;
    setState({
      ...state,
      buttonText: "Activating",
    });

    try {
      const response = await axios.post(`${API}/register/activate`, { token });
      setState({
        ...state,
        name: "",
        token: "",
        buttonText: "Activated",
        success: response.data.message,
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: "Activate account",
        error: error.response.data.error,
      });
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Hello {name},</h1>
          <h4>Click the button to activate your account :)</h4>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          <button
            className="btn btn-outline-warning col-12"
            onClick={clickSubmit}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ActivateAccount);
