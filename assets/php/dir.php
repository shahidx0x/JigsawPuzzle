<?php

$dir = '../galleries';

$items = array();

$dir1 = new DirectoryIterator($dir);

$supportedExtensions = array('jpg', 'png');

foreach ($dir1 as $folderInfo) {
    if ($folderInfo->isDir() && !$folderInfo->isDot()) {
        $folder = $folderInfo->getFilename();
        $filesPath = $dir.'/'.$folder.'/';
        $obj = (object)array();
        $obj->folder = $folder;
        $files = array();
        $directory = new DirectoryIterator($filesPath);
        foreach ($directory as $finfo) {
            if ($finfo->isFile()) {
                $extension = strtolower(pathinfo($finfo->getFilename(), PATHINFO_EXTENSION));
                if (in_array($extension, $supportedExtensions)) {
                    $files[] = $finfo->getFilename();
                }
            }
        }
        $obj->files = $files;
        $items[] = $obj;
    }
}

$json_data = json_encode($items, JSON_PRETTY_PRINT);
file_put_contents('dev.json', $json_data);

echo $json_data;
?>