import React, { useEffect } from "react";

<script type="text/babel"></script>
const KakaoLogin = () => {
  const KAKAO_AUTH_URL = process.env.REACT_APP_KAKAO_AUTH_URL; // 서버에서 제공되는 카카오 로그인 URL

  // 카카오 로그인 URL로 리다이렉트
  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Kakao Login</h1>
      <button
        onClick={handleKakaoLogin}
        className="px-4 py-2 bg-yellow-500 text-white rounded"
      >
        Login with Kakao
      </button>
    </div>
  );
};

const KakaoCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  useEffect(() => {
    if (code) {
      // 백엔드의 /callback API 호출
      fetch(`/callback?code=${code}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Kakao Login Response:", data);
          alert("Kakao Login Successful!");
        })
        .catch((error) => console.error("Error during Kakao login:", error));
    }
  }, [code]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Processing Kakao Login...</h1>
    </div>
  );
};

export { KakaoLogin, KakaoCallback };
