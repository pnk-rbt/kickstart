import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';

import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import { Router } from '../routes';
 
export default class RequestRow extends Component {
  state = {
    errorMessage: '',
    loadingApproval: false,
    loadingFinalize: false
  };

  onApprove = async (event) => {
    event.preventDefault();
    this.setState({ errorMessage: '', loadingApproval: true });

    const { campaignAddress, id } = this.props;

    try {
      const accounts = await web3.eth.getAccounts();

      const campaign = Campaign(campaignAddress);

      await campaign.methods
        .approveRequest(id)
        .send({
          from: accounts[0]
        });
      
      Router.replaceRoute(`/campaign/${campaignAddress}/requests`);

    } catch(error) {
      this.setState({ errorMessage: error.message });
    }

    this.setState({ loadingApproval: false });
  };

  onFinalize = async (event) => {
    console.log('in onFinalize');
    event.preventDefault();
    this.setState({ errorMessage: '', loadingFinalize: true });

    const { campaignAddress, id } = this.props;

    try {
      const accounts = await web3.eth.getAccounts();

      const campaign = Campaign(campaignAddress);

      await campaign.methods
        .finalizeRequest(id)
        .send({
          from: accounts[0]
        });
      
      Router.replaceRoute(`/campaign/${campaignAddress}/requests`);

    } catch(error) {
      this.setState({ errorMessage: error.message });
    }

    this.setState({ loadingFinalize: false });
  };

  render() {
    const { Row, Cell } = Table;
    const { loadingApproval, loadingFinalize } = this.state;
    const { approversCount, id, request } = this.props;
    const { 
      approvalCount,
      complete,
      description,
      recipient,
      value
    } = request;
    const readyToFinalize = request.approvalCount > approversCount/2;

    return (
      <Row disabled={ request.complete } positive={ readyToFinalize && !request.complete}>
        <Cell>{ id }</Cell>
        <Cell>{ description }</Cell>
        <Cell>{ web3.utils.fromWei(value, 'ether') }</Cell>
        <Cell>{ recipient }</Cell>
        <Cell>{ approvalCount }/{ approversCount }</Cell>
        <Cell>
          <Button
            basic
            color='green'
            content='Approve'
            loading={ loadingApproval }
            onClick={ this.onApprove }
          />
        </Cell>
        <Cell>
          <Button
            basic
            color='teal'
            content='Finalize'
            loading={ loadingFinalize }
            onClick={ this.onFinalize }
          />
        </Cell>
      </Row>
    );
  }
};