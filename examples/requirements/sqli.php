<?php

/**
 * Created by PhpStorm.
 * User: Benjaco
 * Date: 27-03-14
 * Time: 08:14
 */
class sqli
{
    /** @var $connection mysqli */
    private $connection = null;

    function __construct($conf)
    {
        $this->connection = new mysqli($conf[0], $conf[1], $conf[2], $conf[3]);
    }

    /**
     * @param $query
     * @param $dataMode
     * @param $parameters
     * @return stdClass
     */
    public function push($query, $dataMode = null, $parameters = null)
    {
        $return = (object) array("status" => true, "error_msg" => "", "affected_rows" => 0);
        if ($stmt = $this->connection->prepare($query)) {
            $bindingparams = func_get_args();
            unset($bindingparams[0]);
            if (count($bindingparams) != 0) {
                $bindingparams = array_values($bindingparams);
                if ( strlen($bindingparams[0]) == count($bindingparams)-1 ) {
                    call_user_func_array(array($stmt, "bind_param"), $this->refValues($bindingparams));
                } else {
                    $return->error_msg="Bindede vaerdiger og datamode stemmer ikke overens";
                }
            }
            $stmt->execute();
            if (substr(strtolower($query), 0, 6) == "insert") {
                $return->insert_id = $stmt->insert_id;
            }
            $return->affected_rows = $stmt->affected_rows;
            $stmt->close();
        } else {
            $return->status = false;
            $return->error_msg = $this->connection->error;
        }
        return $return;
    }

    /**
     * @param $query
     * @param $dataMode
     * @param $parameters
     * @return stdClass
     */
    public function pull_once($query, $dataMode = null, $parameters = null)
    {
        $return = (object)array("status" => true, "data" => array(), "error_msg" => "", "row_count" => 0);
        if ($stmt = $this->connection->prepare($query)) {
            $bindingparams = func_get_args();
            unset($bindingparams[0]);
            if (count($bindingparams) != 0) {
                $bindingparams = array_values($bindingparams);
                if ( strlen($bindingparams[0]) == count($bindingparams)-1 ) {
                    call_user_func_array(array($stmt, "bind_param"), $this->refValues($bindingparams));
                } else {
                    $return->error_msg="Bindede vaerdiger og datamode stemmer ikke overens";
                }
            }
            $stmt->execute();
            $stmt->store_result();
            $return->row_count = $stmt->num_rows;
            if($return->row_count){
                $this->bind_array($stmt, $info);
                $stmt->fetch();
                $return->data = $info;
            }

            $stmt->close();
        } else {
            $return->status = false;
            $return->error_msg = $this->connection->error;
        }
        return $return;
    }

    /**
     * @param $query
     * @param $dataMode
     * @param $parameters
     * @return stdClass
     */
    public function pull_multiple($query, $dataMode = null, $parameters = null)
    {
        $return = (object) array("status" => true, "data" => array(), "error_msg" => "", "row_count" => 0);
        if ($stmt = $this->connection->prepare($query)) {
            $bindingparams = func_get_args();
            unset($bindingparams[0]);
            if (count($bindingparams) != 0) {
                $bindingparams = array_values($bindingparams);
                if ( strlen($bindingparams[0]) == count($bindingparams)-1 ) {
                    call_user_func_array(array($stmt, "bind_param"), $this->refValues($bindingparams));
                } else {
                    $return->error_msg="Bindede vaerdiger og datamode stemmer ikke overens";
                }
            }
            $stmt->execute();

            $stmt->store_result();
            $return->row_count = $stmt->num_rows;


            $this->bind_array($stmt, $info);
            while ($stmt->fetch()) {
                $row = array();
                foreach ($info as $coll_k => $coll_v) {
                    $row[$coll_k] = $coll_v;
                }
                array_push($return->data, $row);
            }
            $stmt->close();
        } else {
            $return->status = false;
            $return->error_msg = $this->connection->error;
        }
        return $return;
    }

    /**
     * @param $arr
     * @return stdClass
     */
    private function refValues($arr)
    {
        if (strnatcmp(phpversion(), '5.3') >= 0) {
            $refs = array();
            foreach ($arr as $key => $value) {
                $refs[$key] = & $arr[$key];
            }
            return $refs;
        }
        return $arr;
    }


    private function bind_array($stmt, &$row)
    {
        /** @var $stmt mysqli_stmt */
        $md = $stmt->result_metadata();
        $params = array();
        while ($field = $md->fetch_field()) {
            $params[] = & $row[$field->name];
        }
        call_user_func_array(array($stmt, 'bind_result'), $params);
    }
}