export const isLogged = () => {
    const log = JSON.parse(localStorage.getItem("logged"));
    if (log) {
      return log;
    } else {
        return false
    }
  };
 
