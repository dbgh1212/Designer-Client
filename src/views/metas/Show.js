import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Paper,
  Tooltip,
  Button,
  IconButton,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Input,
  InputLabel,
  Checkbox,
  Select,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { display } from "@material-ui/system";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { SubTitle } from "components/typos/Title";
import HelpIcon from "@material-ui/icons/Help";
import SettingsIcon from "@material-ui/icons/Settings";

import MetaRowForm from "./MetaRowForm";
import BorderedTable from "../../components/tables/BorderedTable";
import { PageTitle } from "../../components/typos/Title";
import OperationForm from "./OperationForm";
import { metaActions } from '../../actions/metaActions';
import { alertActions } from '../../actions/alertActions';

const xsWidth = 767;

const formHeaders = [
  { key: "formHeader1", name: "원본 컬럼명" },
  {
    key: "formHeader2",
    name: "제공 컬럼명",
    tooltip: "활용자에게 제공되는 컬럼 명칭입니다.",
  },
  { key: "formHeader3", name: "컬럼 타입" },
  { key: "formHeader4", name: "최대 길이", tooltip: "정수: 자릿수, 소수: 전체자릿수, 소수점 자릿수" },
  { key: "formHeader5", name: "날짜 형식", tooltip: "ex) yyyy-MM-dd HH:mm:ss" },
  { key: "formHeader6", name: "빈값 허용" },
  { key: "formHeader7", name: "검색 설정" },
];

const useStyles = makeStyles((theme) => ({
  flexTableContainer: {
    display: "block",
  },
  flexTable: {
    display: "flex",
    flexFlow: "row wrap",
    borderLeft: "1px solid #ddd",
  },
  flexRow: {
    textAlign: "left",
    width: `calc(100% / ${formHeaders.length})`,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    backgroundColor: "#fff",
    borderRight: "solid 1px #ddd",
    borderBottom: "solid 1px #ddd",
    "&.text": {
      display: "flex",
      alignItems: "center",
    },
    "&.header": {
      textAlign: "center",
    },
    "& .form": {
      fontSize: "0.875rem",
    },
  },
  formControl: {
    width: "100%",
  },
  [theme.breakpoints.up("sm")]: {
    formControl: {
      "& .label": {
        display: "none",
      },
      "& .form": {
        marginTop: 0,
      },
      "& .helpText": {
        display: "none",
      },
    },
  },
  [theme.breakpoints.down("sm")]: {
    flexTable: {
      marginBottom: 16,
      boxShadow:
        "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    },
    flexRow: {
      width: "100%",
      "&.header": {
        display: "none",
        display: "block",
      },
      "&.last": {
        width: "50%",
      },
    },
  },
}));

export function MetaShow(props) {
  const { id } = useParams();
  const metaDict = useSelector((state) => state.metas.dict);
  const meta = metaDict[id];

  const [cols, setCols] = useState();

  // TODO: api / meta / operation 정의 필요
  const operation = {
    title: '오퍼레이션 테스트',
    desc: '오퍼레이션 설명',
    method: 'GET',
    endPoint: 'test-api'
  };  

  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(metaActions.getMeta(id)).then((response) => {
      if(response.error) {
        alertActions.handleError(dispatch, response.error);
        return;
      }
    })  
  }, [])

  useEffect(() => {
    if(meta && meta.columns && !cols) {
      setCols(meta.columns);
    }
  }, [meta])

  const updateCol = (idx, newCol) => {
    const copiedCols = [...cols];
    copiedCols[idx] = newCol;
    setCols(copiedCols);
  };

  const onButtonClick = (e) => {
    /**
     * TODO: API 연동 필요 아래 두가지 API 사용 가능
     * 1: POST /services, PUT /metas/{metaId}/columns 2개 API를 이용하여 각각 저장
     * 2: PUT /metas/{metaId}/columns 로 두 정보를 한번에 update
     */
    history.push({
      pathname: `/apis/${meta.apiId}`,
      state: { meta: meta },
    });
  };

  return (
    <Container>
      <PageTitle text="데이터셋 Meta" />

      {meta && (
        <Box>
          <Box className="BottomGutter">
            <Box textAlign="left">
              <SubTitle
                text="데이터 예시"
                smallText="상위 5건의 원본 데이터를 출력합니다."
              />
            </Box>
            <BorderedTable
              container={Paper}
              size="small"
              headers={meta.columns.map(meta => meta.columnName)}
              rows={JSON.parse(meta.samples).items}
            />
          </Box>

          <Box className="BottomGutter">
            <Box textAlign="left">
              <SubTitle
                text="메타데이터 정의"
                smallText="원천 데이터의 컬럼 정보를 정의합니다."
              />
            </Box>

            <Box className={classes.flexTableContainer}>
              <div className={classes.flexTable}>
                {formHeaders.map((header) => {
                  return (
                    <div
                      key={header.key}
                      className={`${classes.flexRow} header`}
                    >
                      {header.name}
                      {header.tooltip && (
                        <Tooltip title={header.tooltip} placement="right">
                          <IconButton size="small">
                            <HelpIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  );
                })}
              </div>

              {meta.columns.map((col, idx) => {
                return (
                  <MetaRowForm
                    key={`MetaRowForm${idx}`}
                    idx={idx}
                    col={col}
                    updateCol={updateCol}
                    formHeaders={formHeaders}
                    classes={classes}
                  />
                );
              })}
            </Box>
          </Box>

          <Box className="BottomGutter">
            <Box textAlign="left">
              <SubTitle
                text="오퍼레이션 정의"
                smallText="API 호출에 관한 동작방식을 정의합니다."
              />
            </Box>
            <Box>
              <OperationForm classes={classes} operation={operation} />
            </Box>
          </Box>

          <Box textAlign="right">
            <Button variant="contained" color="primary" onClick={onButtonClick}>
              저장
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}
