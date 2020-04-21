import PropTypes from "prop-types";
import React from "react";
import Fieldset from "part:@sanity/components/fieldsets/default";
import DefaultLabel from "part:@sanity/components/labels/default";
import Button from "part:@sanity/components/buttons/default";
import {
  PatchEvent,
  unset,
  set,
  setIfMissing,
} from "part:@sanity/form-builder/patch-event";
import { io, Viewer } from "./bio-pv.min.js";
import Select from "part:@sanity/components/selects/default";
import Spinner from "part:@sanity/components/loading/spinner";
import ActivateOnFocus from "part:@sanity/components/utilities/activate-on-focus";
import Deactivated from "./Deactivated";
import PDBS from "./PDBS";
const debounce = require("lodash.debounce");
import styles from "./PDBInput.css";
import { label as labelStyle } from "part:@sanity/components/formfields/default-style";

const height = "500";

const VIEWER_OPTIONS = {
  width: "auto",
  height,
  antialias: true,
  fog: true,
  outline: true,
  quality: "high",
  style: "phong",
  selectionColor: "white",
  transparency: "screendoor",
  background: "#fff",
  animateTime: 500,
  doubleClick: null,
};

const DEFAULT_PDB = PDBS[0].id;

const getAttr = (value, propName) => value && value[propName];

export default class ProteinInput extends React.Component {
  static propTypes = {
    type: PropTypes.shape({
      title: PropTypes.string,
    }).isRequired,
    value: PropTypes.shape({
      _type: PropTypes.string,
      pdb: PropTypes.string,
      camera: PropTypes.shape({
        rotation: PropTypes.arrayOf(PropTypes.number),
        center: PropTypes.arrayOf(PropTypes.number),
        zoom: PropTypes.number,
      }),
    }),
    readOnly: PropTypes.bool,
    level: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  };

  state = {
    isLoading: true,
  };

  componentDidMount() {
    const { value } = this.props;
    this.viewer = new Viewer(this._viewerElement, VIEWER_OPTIONS);
    const saveFunction = debounce(this.saveCamera, 100);
    this.viewer.on("viewpointChanged", saveFunction);
    this.loadPdb((value && value.pdb) || DEFAULT_PDB);
  }

  componentWillUnmount() {
    this.viewer.destroy();
  }

  componentDidUpdate(prevProps) {
    const camera = getAttr(this.props.value, "camera");
    const prevPdb = getAttr(prevProps.value, "pdb");
    const pdb = getAttr(this.props.value, "pdb");

    if (prevPdb !== pdb) {
      this.loadPdb(pdb);
      return;
    }

    if (camera) {
      this.updateViewerCamera(camera);
    } else {
      this.resetViewerCamera();
    }
  }

  loadPdb(id) {
    this.setState({
      isLoading: true,
    });
    this.viewer.clear();
    io.fetchPdb(`//www.rcsb.org/pdb/files/${id}.pdb`, (structure) => {
      const ligand = structure.select({ rnames: ["SAH", "RVP"] });
      this.viewer.spheres("structure.ligand", ligand, {});
      this.viewer.cartoon("structure.protein", structure, {
        boundingSpheres: false,
      });
      this.setState({
        isLoading: false,
      });
    });
  }

  updateViewerCamera = (camera) => {
    this.viewer.setCamera(camera.rotation, camera.center, camera.zoom);
  };

  resetViewerCamera = () => {
    this.viewer.autoZoom();
  };

  saveCamera = () => {
    const { onChange, type, readOnly = false } = this.props;
    if (readOnly) {
      return;
    }
    const _rotation = this.viewer.rotation();
    const _center = this.viewer.center();
    const _zoom = this.viewer.zoom();
    onChange(
      PatchEvent.from([
        setIfMissing({ _type: type.name, pdb: DEFAULT_PDB }),
        set(
          {
            rotation: Array.from(_rotation),
            center: Array.from(_center),
            zoom: _zoom,
          },
          ["camera"]
        ),
      ])
    );
  };

  handleSelectChange = (item) => {
    this.setPdb(item.id);
  };

  handlePdbStringChange = (event) => {
    const pdbId = event.target.value;
    if (pdbId && pdbId.length === 4) {
      this.setPdb(pdbId);
    }
  };

  handleResetCamera = () => {
    this.props.onChange(PatchEvent.from([unset(["camera"])]));
  };

  setPdb(pdbId) {
    const { onChange, type } = this.props;
    onChange(
      PatchEvent.from([
        setIfMissing({ _type: type.name }),
        set(pdbId, ["pdb"]),
        unset(["camera"]),
      ])
    );
  }

  getPdbById = (id) => {
    return PDBS.find((item) => item.id === id);
  };

  focus() {
    if (this._inputElement) {
      this._inputElement.focus();
    }
  }

  setInputElement = (element) => {
    this._inputElement = element;
  };

  setViewerElement = (element) => {
    this._viewerElement = element;
  };

  render() {
    const { value, type, level, readOnly = false } = this.props;
    const pdbId = (value && value.pdb) || DEFAULT_PDB;
    const { isLoading } = this.state;

    const innerViewer = (
      <div className={styles.viewer} ref={this.setViewerElement} />
    );

    return (
      <Fieldset
        legend={type.title}
        level={level}
        description={type.description}
      >
        <DefaultLabel className={labelStyle} level={level}>
          Pick a PDB model
        </DefaultLabel>
        <Select
          disabled={readOnly}
          ref={this.setInputElement}
          items={PDBS}
          onChange={this.handleSelectChange}
          value={this.getPdbById(pdbId)}
        />
        <div
          style={{
            height: height + "px",
            width: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {isLoading && (
            <div
              style={{
                zIndex: 100,
                backgroundColor: "rgba(255,255,255,0.8)",
                width: "100%",
                height: "100%",
              }}
            >
              <Spinner center />
            </div>
          )}
          {readOnly && (
            <Deactivated message="Read only mode">{innerViewer}</Deactivated>
          )}
          {!readOnly && <ActivateOnFocus>{innerViewer}</ActivateOnFocus>}
        </div>
        <div className={styles.buttons}>
          <Button disabled={readOnly} onClick={this.handleResetCamera}>
            Reset camera
          </Button>
        </div>
      </Fieldset>
    );
  }
}
