import Layout from "../components/layout";
import axios from "axios";
import { API } from "../config";
import Link from "next/link";

const Home = ({ categories }) => {
  const listCategories = () =>
    categories.map((c, key) => (
      <Link href="/">
        <a
          style={{ border: "1px solid #0d6efd" }}
          className="bg-light col-md-4 p-3"
        >
          <div>
            <div className="row">
              <div className="col-md-4">
                <img
                  src={c.image.url}
                  alt="/"
                  style={{ width: "100px", height: "auto" }}
                  className="pe-3"
                />
              </div>
              <div className="col-md-8">{c.name}</div>
            </div>
          </div>
        </a>
      </Link>
    ));

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1 className="font-weight-bold">Browse Categories</h1>
          <br />
        </div>
      </div>
      <div className="row">{listCategories()}</div>
    </Layout>
  );
};
Home.getInitialProps = async () => {
  const response = await axios.get(`${API}/categories`);
  return {
    categories: response.data,
  };
};

export default Home;
