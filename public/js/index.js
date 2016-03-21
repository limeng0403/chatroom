var socket = io();

angular.module('chatApp', [])
    .directive('posttext', function() {
        return {
            restrict: 'EAC',
            link: function($scope, $ele, $atr) {
                $scope.$on('new msg', function(d, newValue) {
                    var title = newValue.userName;
                    var body = newValue.msg;
                    var msgType = 'is-info';

                    if (newValue) {
                        switch (newValue) {
                            case 'transport close':
                                title = '服务器';
                                body = '服务器中断， 请等待.....';
                                msgType = 'is-danger';
                                break;
                            default:
                        }

                        if (newValue.userId === 0) {
                            msgType = 'is-warning';
                        }

                        var template = '<span class="tag ' + msgType + '"><em>' + title + '</em>：<br />' + body + '</span><br /><br />';

                        $ele.append(template);

                        $ele[0].scrollTop = $ele[0].scrollHeight;
                    }
                });
            }
        }
    })
    .directive('userlist', function() {
        return {
            restrict: 'EAC',
            link: function($scope, $ele, $atr) {
                $ele.append('<p class="menu-heading">用户列表</p>');
                $scope.$on('user list', function(d, newValue) {
                    if (newValue) {
                        $ele.html('');
                        $ele.append('<p class="menu-heading">用户列表</p>');

                        for (i in newValue) {
                            $ele.append('<a class="menu-block is-active" href="javascript:;"><span class="menu-icon">a</span>' + newValue[i].userId + '</a>');
                        }
                    }
                });
            }
        }
    })
    .controller('chatMainCtrl', ['$scope', '$interval', function($scope, $interval) {
        $scope.postText = '';
        $scope.userList = [];
        $scope.event = this;

        $scope.postSentEvent = function() {
            socket.emit('chat message', $scope.postText);
            $scope.postText = '';

            return false;
        }

        $scope.postTextKeydownEvent = function() {
            if ($scope.event.keyCode == 13) {
                $scope.postSentEvent();
            }
        }

        socket.on('chat message', function(msg) {
            $scope.$emit('new msg', msg);

            return false;
        });

        socket.on('disconnect', function(msg) {
            $scope.$emit('new msg', msg);

            return false;
        });

        socket.on('user list', function(msg) {
            $scope.$emit('user list', msg);

            return false;
        });
    }])
