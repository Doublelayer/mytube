import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { renameKeys } from '../../utils/helpers';
import * as adminActions from '../../store/actions/admin';

import { MultiSelectDropdown } from '../../utils/Exporter';

import CheckboxTree from 'react-checkbox-tree';
import {
  Divider,
  Form,
  Button,
  Header,
  Icon,
  Accordion,
  TextArea,
  Segment,
  Checkbox,
  Message,
  Progress,
  Transition,
} from 'semantic-ui-react';

import { isFetching, getAllStoredDirectoryTrees, getVideoExtNames } from '../../store/reducers/admin';

import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import 'font-awesome/css/font-awesome.min.css';

import './VideoSettings.scss';

import { SemanticToastContainer, toast } from 'react-semantic-toasts';

import 'react-semantic-toasts/styles/react-semantic-alert.css';

import { API_ROOT } from '../../services/url/api-endpoints';

import socketIOClient from 'socket.io-client';
const socket = socketIOClient(API_ROOT);

class VideoSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      rootPathError: false,
      rootPath: '',
      filter: [],
    };
  }

  componentDidMount() {
    // fetch('http://localhost:5000/api/v1/video/connect');
    const { isFetching, directories } = this.props;
    if (!isFetching && directories.length === 0) {
      this.props.actions.fetchStoredDirectories();
    }
  }

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    console.log(index);
    this.setState({ activeIndex: newIndex });
  };

  handleSubmit = (e) => {
    const { rootPath, filter } = this.state;
    e.preventDefault();
    var error = false;

    if (rootPath === '') {
      this.setState({ rootPathError: true });
      error = true;
    } else {
      this.setState({ rootPathError: false });
    }

    if (filter.length === 0) {
      this.setState({ filterError: true });
      error = true;
    }
    !error && this.props.actions.fetchDirectoryTree(rootPath, filter);
  };

  handleUpdateDatabase = (id) => {
    this.props.actions.updateDatabase(this.state[id].checked, id);

    socket.off(id);
    socket.on(id, (data) => {
      const state = this.state;
      state[id].log = state[id].log + '\n' + data;
      this.setState(state);
    });

    socket.off(`${id}-progress`);
    socket.on(`${id}-progress`, (data) => {
      const state = this.state;
      state[id].progress = {
        total: data.total,
        value: data.value,
        error: state[id].progress ? state[id].progress.error : '',
      };
      this.setState(state);
    });
    socket.off(`${id}-exception`);
    socket.on(`${id}-exception`, (data) => {
      const state = this.state;
      state[id].progress = {
        total: state[id].progress.total,
        value: state[id].progress.value,
        error: data.err,
      };
      this.setState(state);
    });
    socket.off(`${id}-finished`);
    socket.on(`${id}-finished`, (data) => {
      this.props.actions.fetchStoredDirectories();
      const state = this.state;
      state[id].log = state[id].log + '\n' + data;
      this.setState(state);
    });
  };

  handleExpand = (id, expanded) => {
    const state = this.state;
    if (!state[id]) {
      state[id] = [];
    }
    state[id].expanded = expanded;
    this.setState(state);
  };

  handleOnCheck = (id, values) => {
    const state = this.state;

    try {
      state[id].checked = values;
    } catch (error) {
      state[id] = [];
      state[id].checked = values;
    }
    this.setState(state);
  };

  handleOptionChange = (event, { value }) => {
    this.setState({ filter: value });
  };

  handleRefreshTree = (id, rootPath, filter) => {
    var extNames;
    try {
      extNames = this.state[id].extNames;
      if (!extNames) {
        throw new Error();
      }
    } catch (error) {
      extNames = filter;
    }

    if (extNames.length === 0) {
      const params = {
        title: 'Fehler',
        description: 'Es muss mindestens ein Dateiformat ausgwählt werden',
        type: 'error',
        icon: 'times',
      };
      this.notify(params);
    } else {
      this.props.actions.findTree(rootPath, extNames);
    }
  };

  handleTreeExtNamesChanged = (id, extNames) => {
    const state = this.state;
    try {
      state[id].extNames = extNames;
    } catch (error) {
      state[id] = [];
      state[id].extNames = extNames;
    }

    this.setState(state);
  };

  render() {
    const { filter, rootPath, rootPathError, activeIndex } = this.state;
    const { isFetching, directories, extNames } = this.props;
    return (
      <div>
        <SemanticToastContainer />

        <Divider horizontal>
          <Header as="h4">
            <Icon name="folder outline" />
            Verzeichnis & Filter
          </Header>
        </Divider>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="Verzeichnis"
              name="rootPath"
              icon="folder open"
              iconPosition="left"
              onChange={(e) => this.setState({ rootPath: e.target.value })}
              error={rootPathError}
            />
            <div className="field">
              <label>Filter</label>
              <MultiSelectDropdown options={extNames} handleOptionChange={this.handleOptionChange} />
            </div>
          </Form.Group>
          <Button
            loading={isFetching}
            type="submit"
            color="red"
            content=""
            icon="save outline"
            label={{ basic: true, color: 'red', pointing: 'left', content: 'Hinzufügen' }}
            disabled={!rootPath || rootPathError || filter.length === 0}
          />
        </Form>

        <Divider horizontal>
          <Header as="h4">
            <Icon name="braille" />
            Description
          </Header>
        </Divider>

        <Accordion fluid styled>
          {Object.values(directories).map((entry, key) => {
            var equal = true;
            var stateChecked = !this.state[entry._id] || !this.state[entry._id].checked ? null : this.state[entry._id].checked;
            if (stateChecked) {
              equal = JSON.stringify(stateChecked) === JSON.stringify(entry.inserted);
            }
            const entryStateExists = this.state[entry._id] ? true : false;

            return (
              <div key={entry._id}>
                <Accordion.Title active={activeIndex === key} index={key} onClick={this.handleAccordionClick}>
                  <Icon name="dropdown" />
                  {entry.root}
                </Accordion.Title>
                <Accordion.Content active={activeIndex === key}>
                  {entry.tree ? (
                    <CheckboxTree
                      nodes={[
                        renameKeys(entry.tree, {
                          path: 'value',
                          name: 'label',
                        }),
                      ]}
                      checked={!stateChecked ? entry.inserted : stateChecked}
                      expanded={this.state[entry._id] ? this.state[entry._id].expanded : [entry.root]}
                      onCheck={(checked) => {
                        this.handleOnCheck(entry._id, checked);
                      }}
                      onExpand={(expanded) => {
                        this.handleExpand(entry._id, expanded);
                      }}
                      showExpandAll={true}
                    />
                  ) : (
                    <Message warning>
                      <Message.Header>Keine Videos gefunden!</Message.Header>
                      <p>Versuche es mit einem anderen Filter...</p>
                    </Message>
                  )}
                  <Divider />
                  <div className="field">
                    <label>Filter</label>
                    <MultiSelectDropdown
                      fluid
                      options={extNames}
                      selected={entry.filter.extName}
                      handleOptionChange={(e, value) => this.handleTreeExtNamesChanged(entry._id, value.value)}
                    />
                  </div>
                  <Divider />
                  <Segment.Group horizontal>
                    <Segment color="red">
                      <Button
                        fluid
                        loading={isFetching}
                        content="Datenbank aufbauen"
                        icon="database"
                        labelPosition="left"
                        onClick={() => this.handleUpdateDatabase(entry._id)}
                        disabled={equal}
                      />
                    </Segment>
                    <Segment color="red">
                      <Button
                        fluid
                        loading={isFetching}
                        content="Aktualisieren"
                        icon="sync alternate"
                        labelPosition="left"
                        onClick={() => this.handleRefreshTree(entry._id, entry.root, entry.filter.extName)}
                      />
                    </Segment>
                    <Segment color="red">
                      <Button
                        fluid
                        loading={isFetching}
                        content="Löschen"
                        icon="delete"
                        labelPosition="left"
                        onClick={() => console.log('delete')}
                      />
                    </Segment>
                    <Segment color="red" textAlign="center">
                      <Checkbox toggle label={`Watcher ${true ? 'aktiviert' : 'deaktiviert'}`} />
                    </Segment>
                  </Segment.Group>
                  {entryStateExists && (
                    <Form>
                      {<ProgressLogArea log={this.state[entry._id].log} />}
                      {<ProgressBar progress={this.state[entry._id].progress} />}
                    </Form>
                  )}
                </Accordion.Content>
              </div>
            );
          })}
        </Accordion>
        <Divider />
      </div>
    );
  }
}

function ProgressLogArea(log) {
  if (!log.log) {
    return <div></div>;
  }
  return <TextArea style={{ minHeight: 400 }} value={log.log ? log.log : ''} placeholder="" />;
}

function ProgressBar(progress) {
  if (!progress.progress) {
    return <div></div>;
  }

  if (progress.err) {
    return (
      <Progress percent={100} inverted progress error>
        {progress.err}
      </Progress>
    );
  }

  const { total, value } = progress.progress;

  if (!total || !value) {
    return <Progress percent={100} disabled />;
  }

  if (total > value) {
    return <Progress value={value} total={total} progress="ratio" indicating />;
  }

  return (
    <Progress percent={100} success>
      The progress was successful
    </Progress>
  );
}

function mapStateToProps(state) {
  return {
    isFetching: isFetching(state),
    directories: getAllStoredDirectoryTrees(state),
    extNames: getVideoExtNames(state),
  };
}

function mapDispatchToProps(dispatch) {
  const fetchDirectoryTree = adminActions.directoryTree.request;
  const fetchStoredDirectories = adminActions.storedDirectories.request;
  const findTree = adminActions.findTree.request;
  const updateDatabase = adminActions.updateDatabase.request;

  return {
    actions: bindActionCreators({ fetchDirectoryTree, fetchStoredDirectories, findTree, updateDatabase }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoSettings);
