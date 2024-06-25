import GenderCheckBox from "./GenderCheckBox"

const Signup = () => {
  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
        <div className="w-full p-6 bg-purple-700 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 border-gray-100">
            <h1 className="text-3xl font-semibold text-center text-gray-300">
                Signup <span className="text-purple-500">ChatApp</span>
            </h1>

            <form>
                <div>
                    <label className="label p-2">
                        <span className="text-base label-text">Full Name</span>
                    </label>
                    <input type="text" placeholder="Name" className="w-full input input-bordered h-10" />
                </div>

                <div>
                    <label className="label p-2">
                        <span className="text-base label-text">Username</span>
                    </label>
                    <input type="text" placeholder="Username" className="w-full input input-bordered h-10" />
                </div>
                <div>
                    <label className="label p-2">
                        <span className="text-base label-text">Password</span>
                    </label>
                    <input type="text" placeholder="Password" className="w-full input input-bordered h-10" />
                </div>
                <div>
                    <label className="label p-2">
                        <span className="text-base label-text">Confirm Password</span>
                    </label>
                    <input type="text" placeholder="Confim Password" className="w-full input input-bordered h-10" />
                </div>

                <GenderCheckBox />

                <a className="text-sm hover:underline hover:text-purple-600 mt-4 inline-block" href="#">Already have an account ? </a>

                <div>
                    <button className="btn btn-block btn-sm mt-2 border border-slate-700 btn-outline btn-secondary">
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Signup