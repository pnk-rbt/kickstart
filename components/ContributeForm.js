import React, { Component } from 'react';
import { Form, Input, Message } from 'semantic-ui-react';

import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import { Router } from '../routes';
 
class ContributeForm extends Component {
  state = {
    amount: '',
    errorMessage: '',
    loading: false
  };

  onChange = (event) => {
    this.setState({
      errorMessage: '',
      amount: event.target.value
    });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ errorMessage: '', loading: true });

    const { campaignAddress } = this.props;

    try {
      const accounts = await web3.eth.getAccounts();

      const campaign = Campaign(campaignAddress);

      await campaign.methods
        .contribute()
        .send({
          from: accounts[0],
          value: web3.utils.toWei(this.state.amount, 'ether')
        });
      
      Router.replaceRoute(`/campaign/${campaignAddress}`);

    } catch(error) {
      this.setState({ errorMessage: error.message });
    }

    this.setState({ loading: false });
  };

  render() {
    const {
      amount,
      errorMessage,
      loading
    } = this.state; 

    const { 
      minimumContribution
    } = this.props;

    return (
      <Form error={ !!errorMessage } onSubmit={ this.onSubmit }>
        <Form.Field>
          <label>Contribute to this campaign:</label>
          <Input
            label='ether'
            labelPosition='right'
            placeholder={ minimumContribution }
            value={ amount }
            onChange={ this.onChange }
          />
        </Form.Field>
        <Message error header='Oops!' content={ errorMessage }
        />
        <Form.Button
          content='Contribute'
          loading={ loading }
          primary
        />
      </Form>
    );
  }
};

export default ContributeForm;