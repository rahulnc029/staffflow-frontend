function Loader({ size = "md" }) {

    const sizes = {
        sm: "w-5 h-5",
        md: "w-10 h-10",
        lg: "w-14 h-14",
    };

    return (
        <div
            className={`${sizes[size]} border-4 border-blue-500 border-t-transparent rounded-full animate-spin`}
        ></div>
    );
}

export default Loader;