<?php

class Database {
    private static $instance = null;
    private object $connection;

    function __construct()
    {
        $this->setDB();
    }

    function setDB(): void
    {
        $db_config['SGBD'] = 'mysql';
        $db_config['HOST'] = 'devbdd.iutmetz.univ-lorraine.fr';
        $db_config['DB_NAME'] = 'brochot6u_finaryApp';
        $db_config['USER'] = 'brochot6u_appli';
        $db_config['PASSWORD'] = '32304747';
        try {
            $this->connection = new PDO(
                $db_config['SGBD'] . ':host=' . $db_config['HOST'] . ';dbname=' . $db_config['DB_NAME'],
                $db_config['USER'],
                $db_config['PASSWORD'],
                array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8')
            );
            unset($db_config);
        } catch (Exception $exception) {
            die($exception->getMessage());
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->connection;
    }
}
