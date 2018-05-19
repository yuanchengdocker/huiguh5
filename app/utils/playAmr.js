// import '../sdk/audio.min'
// import '../sdk/voice'

// export default (href) => {


//     // fetchBlob(href, function (blob) {
//     //     playAmrBlob(blob);
//     // });

//     // var gAudioContext = new AudioContext();
//     // function getAudioContext() {
//     //     if (!gAudioContext) {
//     //         gAudioContext = new AudioContext();
//     //     }
//     //     return gAudioContext;
//     // }
//     // function fetchBlob(url, callback) {
//     //     var xhr = new XMLHttpRequest();
//     //     xhr.open('GET', url);
//     //     xhr.responseType = 'blob';
//     //     xhr.onload = function () {
//     //         callback(this.response);
//     //     };
//     //     xhr.onerror = function () {
//     //         alert('Failed to fetch ' + url);
//     //     };
//     //     xhr.send();
//     // }
//     // function readBlob(blob, callback) {
//     //     var reader = new FileReader();
//     //     reader.onload = function (e) {
//     //         var data = new Uint8Array(e.target.result);
//     //         callback(data);
//     //     };
//     //     reader.readAsArrayBuffer(blob);
//     // }
//     // function playAmrBlob(blob, callback) {
//     //     readBlob(blob, function (data) {
//     //         playAmrArray(data);
//     //     });
//     // }
//     // function playAmrArray(array) {
//     //     var samples = AMR.decode(array)
//     //     if (!samples) {
//     //         alert('Failed to decode!');
//     //         return;
//     //     }
//     //     playPcm(samples);
//     // }
//     // function playPcm(samples) {
//     //     var ctx = getAudioContext();
//     //     var src = ctx.createBufferSource();
//     //     var buffer = ctx.createBuffer(1, samples.length, 16000);
//     //     if (buffer.copyToChannel) {
//     //         buffer.copyToChannel(samples, 0, 0)
//     //     } else {
//     //         var channelBuffer = buffer.getChannelData(0);
//     //         channelBuffer.set(samples);
//     //     }
//     //     src.buffer = buffer;
//     //     src.connect(ctx.destination);
//     //     src.start();
//     // }
// }
