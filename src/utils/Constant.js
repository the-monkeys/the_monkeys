class Constant {

    getHeader() {
        return {
            headers: {
                "Content-Type": "application/json",
                Authorization: this.getToken(),
            },
        };
    }

    setToken(payload) {
        localStorage.setItem("token", payload)
    }

    getToken() {
        return localStorage.getItem("token")
    }

}

export default new Constant();