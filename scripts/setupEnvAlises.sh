clear
export SPCOIN_BG_DIR=$PWD
insertOnce() { 
    # echo AAAA 0 = $0 1 = $1 2 = $2
    if  grep -q "$1" "$2" ; then
        echo 'ERROR: LINE:"'$1'" EXISTS IN FILE:"'$2'"' ; 
    else
        echo 'INSERTING: LINE:"'$1'" IN FILE:"'$2'"' ; 
        echo $1 | tee -a $2
    fi
}

echo 'SET UP SPCOIN_ENV_DIR CONFIGURATION FILE: ".e/.e "'
echo "export SPCOIN_BG_NAME=$(basename $PWD)/"              | tee  a $SPCOIN_BG_DIR/.e/.e
echo "export SPCOIN_BG_DIR=$SPCOIN_BG_DIR/"                 | tee -a $SPCOIN_BG_DIR/.e/.e
echo "export SPCOIN_BG_SCRIPTS_DIR=$SPCOIN_BG_DIR/scripts/" | tee -a $SPCOIN_BG_DIR/.e/.e
echo "export SPCOIN_ENV_DIR=$SPCOIN_BG_DIR/.e"              | tee -a $SPCOIN_BG_DIR/.e/.e
echo "export SPCOIN_LOGS_DIR=$SPCOIN_BG_DIR/logs/"          | tee -a $SPCOIN_BG_DIR/.e/.e
echo ". $SPCOIN_BG_DIR/.e/.a"                               | tee -a $SPCOIN_BG_DIR/.e/.e

# SET THE PROJECT ROOT ENVIRONMENT
echo "Starting The Project Environment"
. $SPCOIN_BG_DIR/.env/.e

# SET THE PROJECT ROOT ENVIRONMENT
insertOnce "set -o vi" ~/.bashrc;
insertOnce ". $SPCOIN_BG_DIR/.env/.e" ~/.bashrc;

echo "Starting The Project Environment"
. $SPCOIN_BG_DIR/.e/.e
