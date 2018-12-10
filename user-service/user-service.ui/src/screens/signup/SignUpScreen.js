import React from "react";
import {connect} from "react-redux";
import {userActions} from "../../actions/user.actions";
import CredentialForm from "../../ilma-react/forms/CredentialForm.js";
import colors from "../../ilma-react/colors/colors.js";

class SignUpScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            signUpSubmitted: false,
            validForm: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    componentDidMount() {
    }

    validateForm() {
        return this.state.username.length > 2 && this.state.password.length > 7;
    }


        handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,

        }, () => this.setState({
            validForm: this.validateForm()
        }));

    }

    handleSubmit(event) {
        event.preventDefault();
        const credentials = {
            username: this.state.username,
            password: this.state.password
        };
        this.props.dispatch(userActions.signup(credentials));
        this.setState({
            signUpSubmitted: true
        });
    }

    render() {
        return (
            <div className="col-lg-4" style={{margin: "50px auto"}}>
                <CredentialForm
                    color={colors.green["500"]}
                    title="Sign Up to ilma"
                    onChange={this.handleChange}
                    error={this.props.error}
                    links={[{
                        href: "/",
                        value: "Go back"
                    }]}
                    inputs={[
                        {
                            id: "username",
                            type: "text",
                            label: "USERNAME or EMAIL",
                            hint: ["Use at least 3 characters."]
                        },
                        {
                            id: "password",
                            type: "password",
                            label: "PASSWORD",
                            hint: ["Use at least 8 characters."],
                        },
                        {
                            type: "button",
                            value: "Sign Up",
                            handler: this.handleSubmit,
                            validator: this.state.validForm,
                            hint: ["By signing up to ilma, you agree to our ", <a href="#">Terms and conditions</a>, "."],
                            mode:"big"
                        }
                    ]}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {error} = state.signupReducer;
    console.log(state.signupReducer);
    return {
        error
    };
}

SignUpScreen = connect(mapStateToProps)(SignUpScreen);
export default SignUpScreen;
