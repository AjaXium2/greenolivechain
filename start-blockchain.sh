#!/bin/bash
# Blockchain Network Startup Script for Green Olive Chain

echo "🔗 Starting Green Olive Chain Blockchain Network..."

# Set environment variables
export FABRIC_CFG_PATH=$PWD/network
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="FarmerOrgMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/network/crypto-config/peerOrganizations/farmer.olive.com/peers/peer0.farmer.olive.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=$PWD/network/crypto-config/peerOrganizations/farmer.olive.com/users/Admin@farmer.olive.com/msp
export CORE_PEER_ADDRESS=localhost:7051

echo "📋 Environment configured"

# Start the blockchain network
cd network

echo "🚀 Starting Docker containers..."
docker-compose up -d

echo "⏳ Waiting for containers to start..."
sleep 10

echo "🔧 Creating channel..."
docker exec cli peer channel create -o orderer.olive.com:7050 -c olive-channel -f ./channel-artifacts/channel.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/olive.com/orderers/orderer.olive.com/msp/tlscacerts/tlsca.olive.com-cert.pem

echo "🔗 Joining peers to channel..."
docker exec cli peer channel join -b olive-channel.block

echo "📦 Installing chaincode..."
docker exec cli peer chaincode install -n waste -v 1.0 -p github.com/chaincode/waste

echo "🔨 Instantiating chaincode..."
docker exec cli peer chaincode instantiate -o orderer.olive.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/olive.com/orderers/orderer.olive.com/msp/tlscacerts/tlsca.olive.com-cert.pem -C olive-channel -n waste -v 1.0 -c '{"Args":["init"]}'

echo "✅ Blockchain network started successfully!"
echo "🌐 Network is ready for transactions"
echo "📊 You can now test the API endpoints"

cd ..
