
import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Button, Container, Form, Input, Message } from 'semantic-ui-react'

import web3 from '../../../ethereum/web3';
import Campaign from '../../../ethereum/campaign';
import { Link, Router } from '../../../routes';
 
export default class RequestNew extends Component {
  state = {
    amount: '',
    description: '',
    errorMessage: '',
    loading: false,
    recipient: ''
  };

  static async getInitialProps(props) {
    return { 
      campaignAddress: props.query.address,
    };
  }

  onChangeAmount = (event) => {
    this.setState({
      errorMessage: '',
      amount: event.target.value
    });
  };

  onChangeDescription = (event) => {
    this.setState({
      errorMessage: '',
      description: event.target.value
    });
  };

  onChangeRecipient = (event) => {
    this.setState({
      errorMessage: '',
      recipient: event.target.value
    });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ errorMessage: '', loading: true });

    const { campaignAddress } = this.props;

    const { amount, description, recipient } = this.state;

    try {
      const accounts = await web3.eth.getAccounts();

      const campaign = Campaign(campaignAddress);

      await campaign.methods
        .createRequest(description, web3.utils.toWei(amount, 'ether'), recipient)
        .send({
          from: accounts[0]
        });
      
      Router.replaceRoute(`/campaign/${campaignAddress}/requests`);

    } catch(error) {
      this.setState({ errorMessage: error.message });
    }

    this.setState({ loading: false });
  };

  render() {
    const {
      amount,
      description,
      errorMessage,
      loading,
      recipient
    } = this.state; 

    const { campaignAddress } = this.props;

    return (
      <Layout>
        <Container text>
          <Link route={`/campaign/${campaignAddress}/requests`}>
            <a>
              <Button 
                content="Back"
                primary
              />
            </a>
          </Link>
          <h3>Create a Request</h3>
          <Form error={ !!errorMessage } onSubmit={ this.onSubmit }>
            <Form.Field>
              <label>Description</label>
              <Input
                onChange={ this.onChangeDescription }
                placeholder='Paying for...'
                value={ description }
              />
              <label>Amount</label>
              <Input
                label='ether'
                labelPosition='right'
                onChange={ this.onChangeAmount }
                // placeholder={ minimumContribution }
                value={ amount }
              />
              <label>Recipient address</label>
              <Input
                onChange={ this.onChangeRecipient }
                placeholder='0x...'
                value={ recipient }
              />
            </Form.Field>
            <Message error header='Oops!' content={ errorMessage }
            />
            <Form.Button
              content='Create'
              loading={ loading }
              primary
            />
          </Form>
        </Container>
      </Layout>
    );
  }
};