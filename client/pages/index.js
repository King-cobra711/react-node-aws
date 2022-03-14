import Layout from "../components/layout";
import axios from "axios";
import { API } from "../config";
import Link from "next/link";

const Home = ({ categories }) => {
  const listCategories = () =>
    categories.map((c, key) => (
      <Link href={`/links/${c.slug}`} key={key}>
        <a
          style={{ border: "1px solid #0d6efd" }}
          className="bg-light col-md-4 p-3"
        >
          <div>
            <div className="row align-items-center">
              <div className="col-lg-12">
                <img
                  src={c.image.url}
                  alt="/"
                  style={{ width: "100px", height: "auto" }}
                  className="me-3 float-start"
                />
                <h1>{c.name}</h1>
              </div>
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
  console.log(response.data);
  return {
    categories: response.data,
  };
};

export default Home;
