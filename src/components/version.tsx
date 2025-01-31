import { useEffect, useState } from "react";

const Login = () => {
  const [version, setVersion] = useState("");

  useEffect(() => {
    const getVersion = async () => {
      const v = await fetch(`/api/version`);
      const data = await v.json();
      setVersion(data?.version);
    };
    getVersion();
  }, []);

  return <p>version: {version}</p>;
};

export default Login;
