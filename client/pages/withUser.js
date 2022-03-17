import axios from "axios";
import { API } from "../config";
import { getCookie } from "../helpers/auth";

// Server-side rendering with nextjs
// getInitialProps runs in the server-side first and then it runs in the client-side
// Allows you to fetch data before rendering the page, super useful for SEO
// Read more here: https://nextjs.org/docs/api-reference/data-fetching/get-initial-props

// useEffect runs when the component mounts.

const withUser = (Page) => {
  const WithAuthUser = (props) => <Page {...props} />;
  WithAuthUser.getInitialProps = async (context) => {
    const token = getCookie("token", context.req);
    let user = null;
    let userLinks = [];

    if (token) {
      try {
        const response = await axios.get(`${API}/user`, {
          headers: {
            authorization: `Bearer ${token}`,
            contentType: "application/json",
          },
        });
        user = response.data.user;
      } catch (error) {
        console.log("This is error: ", error);
        if (error.response.status === 401) {
          user = null;
        }
      }
    }
    if (user === null) {
      // redirect
      context.res.writeHead(302, {
        Location: "/",
      });
      context.res.end();
    } else {
      return {
        ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
        user,
        token,
      };
    }
  };
  return WithAuthUser;
};

export default withUser;
