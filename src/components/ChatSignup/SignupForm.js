import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import 'semantic-ui-css/semantic.min.css';
import {
  Button, Form, Grid, Header, Segment, Message,
} from 'semantic-ui-react';

/* Style-Wrapper */
const SignupFormWrapper = styled.div`
  max-width: 500px;
  max-height: 440px;
  margin: 0 auto;
  position: relative;
  top: 30%;
  border-radius: 8px;
  background-color: transparent;
  background: rgba(255,255,255,1);
`;
const MessageButton = styled.span`
  color: #4183c4;
  text-decoration: none;
  cursor: pointer;
`;
/* Component */
const SignupForm = (props) => {
  const {
    handleInputEmail, handleInputPassword, handleInputPasswordConfirm,
    handleSignup, handleMoveSigninPage,
  } = props;
  return (
    <SignupFormWrapper>
      <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="grey" textAlign="center">
            Create new account
          </Header>
          <Form size="large">
            <Segment>
              <Form.Input
                icon="user"
                iconPosition="left"
                fluid
                placeholder="E-mail address"
                onChange={handleInputEmail}
              />
              <Form.Input
                icon="lock"
                iconPosition="left"
                fluid
                placeholder="Password"
                type="password"
                onChange={handleInputPassword}
              />
              <Form.Input
                icon="lock"
                iconPosition="left"
                fluid
                placeholder="Password Confirm"
                type="password"
                onChange={handleInputPasswordConfirm}
              />
              <Button
                color="blue"
                size="large"
                fluid
                onClick={handleSignup}
              >
                  Signup
              </Button>
            </Segment>
            <Message>
              Already be registered? &nbsp;
              <MessageButton onClick={handleMoveSigninPage}>
                Sign In
              </MessageButton>
            </Message>
          </Form>
        </Grid.Column>
      </Grid>
    </SignupFormWrapper>
  );
};

SignupForm.propTypes = {
  handleInputEmail: PropTypes.func.isRequired,
  handleInputPassword: PropTypes.func.isRequired,
  handleInputPasswordConfirm: PropTypes.func.isRequired,
  handleSignup: PropTypes.func.isRequired,
  handleMoveSigninPage: PropTypes.func.isRequired,
};

export default SignupForm;
