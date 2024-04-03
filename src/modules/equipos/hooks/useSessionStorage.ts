export const useSessionStorage = (key: string): any | boolean =>{
    const storedValue = sessionStorage.getItem(key);

    if(!storedValue){
        return false;
    }else{
        return storedValue;
    }
}